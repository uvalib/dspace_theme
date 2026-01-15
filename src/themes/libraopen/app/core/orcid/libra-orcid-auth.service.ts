import {
  Inject,
  Injectable,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfigurationDataService } from '../../../../../app/core/data/configuration-data.service';
import { OrcidAuthService } from '../../../../../app/core/orcid/orcid-auth.service';
import { ResearcherProfileDataService } from '../../../../../app/core/profile/researcher-profile-data.service';
import {
  NativeWindowRef,
  NativeWindowService,
} from '../../../../../app/core/services/window.service';
import { Item } from '../../../../../app/core/shared/item.model';
import { URLCombiner } from '../../../../../app/core/url-combiner/url-combiner';

@Injectable()
/**
 * Theme-only override to adjust the ORCID redirect target without altering core service logic.
 */
export class LibraOrcidAuthService extends OrcidAuthService {
  constructor(
    @Inject(NativeWindowService) protected override _window: NativeWindowRef,
    configurationService: ConfigurationDataService,
    researcherProfileService: ResearcherProfileDataService,
    private routerPassedIn: Router,
  ) {
    super(_window, configurationService, researcherProfileService, routerPassedIn);
  }

  override getOrcidAuthorizeUrl(profile: Item): Observable<string> {
    return super.getOrcidAuthorizeUrl(profile).pipe(
      map((url) => {
        const origin = this._window.nativeWindow.origin;
        // ORCID does not allow wildcard redirect URIs, so we always redirect to a fixed UI route
        // and carry the intended destination (e.g. person ORCID page) in the OAuth `state`.
        const targetPath = this.routerPassedIn.url.split('?')[0];
        const redirectUri = new URLCombiner(origin, '/orcid-link').toString();

        const parsed = new URL(url);
        parsed.searchParams.set('redirect_uri', redirectUri);
        parsed.searchParams.set('state', targetPath);
        return parsed.toString();
      }),
    );
  }
}
