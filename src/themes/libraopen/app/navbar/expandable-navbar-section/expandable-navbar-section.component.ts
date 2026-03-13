import {
  AsyncPipe,
  NgComponentOutlet,
} from '@angular/common';
import {
  AfterViewChecked,
  Component,
  HostListener,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { slide } from '../../../../../app/shared/animations/slide';
import { isNotEmpty } from '../../../../../app/shared/empty.util';
import { HostWindowService } from '../../../../../app/shared/host-window.service';
import { MenuService } from '../../../../../app/shared/menu/menu.service';
import { MenuID } from '../../../../../app/shared/menu/menu-id.model';
import { MenuSection } from '../../../../../app/shared/menu/menu-section.model';
import { HoverOutsideDirective } from '../../../../../app/shared/utils/hover-outside.directive';
import { NavbarSectionComponent } from '../navbar-section/navbar-section.component';

/**
 * Theme expandable navbar section – extends theme NavbarSectionComponent so the theme's
 * AbstractMenuSectionComponent (and menu-item.decorator) is used, loading theme TextMenuItemComponent.
 * Uses accessibility-friendly template and .ds-menu-item selectors.
 */
@Component({
  selector: 'ds-themed-expandable-navbar-section',
  templateUrl: './expandable-navbar-section.component.html',
  styleUrls: [
    '../../../../../app/navbar/expandable-navbar-section/expandable-navbar-section.component.scss',
    './expandable-navbar-section.component.scss',
  ],
  animations: [slide],
  standalone: true,
  imports: [
    AsyncPipe,
    HoverOutsideDirective,
    NgComponentOutlet,
  ],
})
export class ExpandableNavbarSectionComponent extends NavbarSectionComponent implements AfterViewChecked, OnInit, OnDestroy {

  /**
   * This section resides in the Public Navbar
   */
  menuID = MenuID.PUBLIC;

  /**
   * True if mouse has entered the menu section toggler
   */
  mouseEntered = false;

  /**
   * Whether the section was expanded
   */
  focusOnFirstChildSection = false;

  /**
   * True if screen size was small before a resize event
   */
  wasMobile: boolean = undefined;

  /**
   * Observable that emits true if the screen is small, false otherwise
   */
  isMobile$: Observable<boolean>;

  /**
   * Boolean used to add the event listeners to the items in the expandable menu when expanded. This is done for
   * performance reasons, there is currently an *ngIf on the menu to prevent the {@link HoverOutsideDirective} to tank
   * performance when not expanded.
   */
  addArrowEventListeners = false;

  /**
   * List of current dropdown items who have event listeners
   */
  private dropdownItems: NodeListOf<HTMLElement>;

  /**
   * Emits true when the top section has subsections, else emits false
   */
  hasSubSections$: Observable<boolean>;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile$.pipe(
      first(),
    ).subscribe((isMobile) => {
      // When switching between desktop and mobile active sections should be deactivated
      if (isMobile !== this.wasMobile) {
        this.wasMobile = isMobile;
        this.menuService.deactivateSection(this.menuID, this.section.id);
        this.mouseEntered = false;
      }
    });
  }

  constructor(
    @Inject('sectionDataProvider') public section: MenuSection,
    protected menuService: MenuService,
    protected injector: Injector,
    protected windowService: HostWindowService,
  ) {
    super(section, menuService, injector);
    this.isMobile$ = this.windowService.isMobile();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.hasSubSections$ = this.subSections$.pipe(
      map((subSections) => isNotEmpty(subSections)),
    );
    this.subs.push(this.active$.subscribe((active: boolean) => {
      if (active === true) {
        this.addArrowEventListeners = true;
      } else {
        this.focusOnFirstChildSection = undefined;
        this.unsubscribeFromEventListeners();
      }
    }));
  }

  ngAfterViewChecked(): void {
    if (this.addArrowEventListeners) {
      // LibraOpen theme: use .ds-menu-item selector instead of *[role="menuitem"] for dropdown items
      this.dropdownItems = document.querySelectorAll(`#${this.expandableNavbarSectionId()} .ds-menu-item`);
      this.dropdownItems.forEach((item: HTMLElement) => {
        item.addEventListener('keydown', this.navigateDropdown.bind(this));
      });
      if (this.focusOnFirstChildSection && this.dropdownItems.length > 0) {
        this.dropdownItems.item(0).focus();
      }
      this.addArrowEventListeners = false;
    }
  }

  override ngOnDestroy(): void {
    this.unsubscribeFromEventListeners();
    super.ngOnDestroy();
  }

  /**
   * Activate this section if it's currently inactive, deactivate it when it's currently active.
   * Also saves whether this toggle was performed by a keyboard event (non-click event) in order to know if thi first
   * item should be focussed when activating a section.
   *
   *  @param {Event} event The user event that triggered this method
   */
  override toggleSection(event: Event): void {
    // Ignore clicks synthesized from keyboard events (Enter/Space) - we handle those in keyDown()
    if (event.type === 'click' && event instanceof MouseEvent && event.detail === 0) {
      return;
    }
    this.focusOnFirstChildSection = event.type !== 'click';
    super.toggleSection(event);
  }

  /**
   * Handle clicks on the dropdown menu - only close if clicking the backdrop (not on links inside)
   */
  onDropdownClick(event: Event): void {
    // Only close if clicking directly on the dropdown menu div (backdrop), not on child elements
    if (event.target === event.currentTarget) {
      this.deactivateSection(event);
    }
  }

  unsubscribeFromEventListeners(): void {
    if (this.dropdownItems) {
      this.dropdownItems.forEach((item: HTMLElement) => {
        item.removeEventListener('keydown', this.navigateDropdown.bind(this));
      });
      this.dropdownItems = undefined;
    }
  }

  /**
   * When the mouse enters the section toggler activate the menu section
   * @param $event
   */
  onMouseEnter($event: Event): void {
    this.isMobile$.pipe(
      first(),
    ).subscribe((isMobile) => {
      if (!isMobile && !this.active$.value && !this.mouseEntered) {
        this.activateSection($event);
      }
      this.mouseEntered = true;
    });
  }

  /**
   * When the mouse leaves the section toggler deactivate the menu section
   * @param $event
   */
  onMouseLeave($event: Event): void {
    this.isMobile$.pipe(
      first(),
    ).subscribe((isMobile) => {
      if (!isMobile && this.active$.value && this.mouseEntered) {
        this.deactivateSection($event);
      }
      this.mouseEntered = false;
    });
  }

  expandableNavbarSectionId(): string {
    return `expandable-navbar-section-${this.section.id}-dropdown`;
  }

  navigateDropdown(event: KeyboardEvent): void {
    if (event.code === 'Tab') {
      this.deactivateSection(event, false);
      return;
    }
    if (event.code === 'Escape') {
      this.deactivateSection(event, false);
      (document.querySelector(`[aria-controls="${this.expandableNavbarSectionId()}"]`) as HTMLElement)?.focus();
      return;
    }
    // LibraOpen theme: Allows inner links to be clicked
    if (event.code !== 'Enter') {
      event.preventDefault();
      event.stopPropagation();
    }
    const items: NodeListOf<Element> = document.querySelectorAll(`#${this.expandableNavbarSectionId()} .ds-menu-item`);
    if (items.length === 0) return;
    const currentIndex = Array.from(items).findIndex((item: Element) => item === event.target);
    if (event.key === 'ArrowDown') {
      (items[(currentIndex + 1) % items.length] as HTMLElement).focus();
    } else if (event.key === 'ArrowUp') {
      (items[(currentIndex - 1 + items.length) % items.length] as HTMLElement).focus();
    }
  }

  /**
   * Handles all the keydown events on the dropdown toggle
   *
   * @param event
   */
  keyDown(event: KeyboardEvent): void {
    switch (event.code) {
      // Works for both Tab & Shift Tab
      case 'Tab':
        this.deactivateSection(event, false);
        break;
      case 'ArrowDown':
        this.focusOnFirstChildSection = true;
        this.activateSection(event);
        break;
      case 'Space':
      case 'Enter':
        event.preventDefault();
        //event.stopPropagation();
        this.toggleSection(event);
        break;
    }
  }
}
