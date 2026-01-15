import {
  AsyncPipe,
  isPlatformBrowser,
} from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

import { ThemedLoadingComponent } from '../../../../app/shared/loading/themed-loading.component';

/**
 * LibraOpen ORCID OAuth redirect URI endpoint for the UI.
 *
 * ORCID does not allow wildcard redirect URIs, so we redirect back here and use the `state`
 * parameter to carry the desired in-app destination (e.g. a person ORCID page).
 *
 * Expected query params from ORCID:
 * - code: OAuth authorization code
 * - state: URL-encoded in-app path
 */
@Component({
  selector: 'ds-orcid-link-callback',
  standalone: true,
  imports: [
    AsyncPipe,
    ThemedLoadingComponent,
    TranslateModule,
  ],
  template: `
    <ds-loading [message]="'person.page.orcid.link.processing' | translate"></ds-loading>
  `,
})
export class OrcidLinkCallbackComponent implements OnInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.route.queryParamMap.pipe(take(1)).subscribe((params) => {
      const code = params.get('code');
      const state = params.get('state');

      const targetPath = this.safeDecodeStateToPath(state) ?? '/';

      void this.router.navigate([targetPath], {
        queryParams: code ? { code } : {},
        replaceUrl: true,
      });
    });
  }

  private safeDecodeStateToPath(state: string | null): string | null {
    if (!state) {
      return null;
    }

    try {
      const decoded = decodeURIComponent(state);

      // Restrict to expected person pages only and prevent scheme-relative URLs.
      if (!decoded.startsWith('/entities/person/') || decoded.startsWith('//')) {
        return null;
      }
      return decoded;
    } catch {
      return null;
    }
  }
}

