import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfigurationDataService } from '../../../../../app/core/data/configuration-data.service';
import { ResearcherProfileDataService } from '../../../../../app/core/profile/researcher-profile-data.service';
import {
  NativeWindowRef,
  NativeWindowService,
} from '../../../../../app/core/services/window.service';
import { Item } from '../../../../../app/core/shared/item.model';
import { URLCombiner } from '../../../../../app/core/url-combiner/url-combiner';
import { OrcidAuthService } from '../../../../../app/core/orcid/orcid-auth.service';

@Injectable()
/**
 * Theme-only override to adjust the ORCID redirect target without altering core service logic.
 */
export class LibraOrcidAuthService extends OrcidAuthService {
  constructor(
    @Inject(NativeWindowService) protected override _window: NativeWindowRef,
    configurationService: ConfigurationDataService,
    researcherProfileService: ResearcherProfileDataService,
    router: Router,
  ) {
    super(_window, configurationService, researcherProfileService, router);
  }

  override getOrcidAuthorizeUrl(profile: Item): Observable<string> {
    return super.getOrcidAuthorizeUrl(profile).pipe(
      map((url) => {
        const redirectUri = new URLCombiner(this._window.nativeWindow.origin, '/server/api/authn/orcid').toString();
        const parsed = new URL(url);
        parsed.searchParams.set('redirect_uri', redirectUri);
        return parsed.toString();
      }),
    );
  }
}
