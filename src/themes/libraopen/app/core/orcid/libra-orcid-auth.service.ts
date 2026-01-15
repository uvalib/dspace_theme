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
 * Theme-only override to adjust the ORCID redirect target
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
        const targetPath = this.routerPassedIn.url.split('?')[0];
        const targetUrl = new URLCombiner(origin, targetPath).toString();
        // Use the DSpace backend ORCID callback and pass UI destination via `redirectUrl`
        const redirectUri = new URLCombiner(origin, '/server/api/authn/orcid').toString()
          + `?redirectUrl=${encodeURIComponent(targetUrl)}`;

        const parsed = new URL(url);
        parsed.searchParams.set('redirect_uri', redirectUri);
        return parsed.toString();
      }),
    );
  }
}
