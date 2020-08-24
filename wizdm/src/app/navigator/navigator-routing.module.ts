import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { BackLinkObserver, CloseLinkObserver, WelcomeBack } from './utils';
import { matchUserNameOnly } from 'app/pages/profile/matcher';
import { matchFullPath } from 'app/pages/static/matcher';
import { NavigatorComponent } from './navigator.component';
import { Oauth2Handler } from 'app/utils/oauth2-handler';
import { ActionLinkObserver } from '@wizdm/actionlink';
import { RedirectService } from '@wizdm/redirect';
import { UserPreferences } from 'app/utils/user';
import { NgModule } from '@angular/core';

const routes: RoutesWithContent = [

  // Auth handler (for firebase password confirmation/reset and stuff)
  { path: 'auth/action', pathMatch: 'full', canActivate: [ Oauth2Handler ] },

  // External links redirection helper
  { path: 'redirect', canActivate: [ RedirectService ] },
  
  // Enables language autodetection on empty routes
  { path: '', redirectTo: 'auto', pathMatch: 'full' },
  
  // Loads the main window (navigator) together with the localized content 
  {
    path: ':lang',
    
    component: NavigatorComponent,
    
    canActivate: [ WelcomeBack, UserPreferences ],
    
    content: ['navigator', 'navigator/login', 'navigator/feedback'],
    
    children: [

      // Not found page
      { path: 'not-found', loadChildren: () => import('../pages/not-found/not-found.module').then(m => m.NotFoundModule) },
      { path: '404', redirectTo: 'not-found', pathMatch: 'full' },

      // Landing page
      { path: '', pathMatch: 'full', loadChildren: () => import('../pages/landing/landing.module').then(m => m.LandingModule) },
      { path: 'home', redirectTo: '', pathMatch: 'full' },
      
      // Content browsing
      { path: 'explore', loadChildren: () => import('../pages/explore/explore.module').then(m => m.ExploreModule) },
      { path: 'welcome-back', redirectTo: 'explore', pathMatch: 'full' }, 

      // Instant messaging
      { path: 'chat', loadChildren: () => import('../pages/chat/chat.module').then(m => m.ChatModule) },

      // User's profile (matching @username)
      { matcher: matchUserNameOnly, loadChildren: () => import('../pages/profile/profile.module').then(m => m.ProfileModule) },

      // Donate
      { path: 'donate', loadChildren: () => import('../pages/donate/donate.module').then(m => m.DonateModule) },

      // Settings
      { path: 'settings', loadChildren: () => import('../pages/settings/settings.module').then(m => m.SettingsModule) },

      // Admin tools
      { path: 'admin', loadChildren: () => import('../pages/admin/admin.module').then(m => m.AdminModule) },

      // Action links
      { path: 'login',   canActivate: [ ActionLinkObserver ], loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
      { path: 'contact', canActivate: [ ActionLinkObserver ], loadChildren: () => import('./feedback/feedback.module').then(m => m.FeedbackModule) },
      { path: 'back',    canActivate: [ BackLinkObserver ] },
      { path: 'close',   canActivate: [ CloseLinkObserver ] },
            
      // Static content pages (about, terms, ...), redirecting to NotFound when no content is available
      { matcher: matchFullPath, loadChildren: () => import('../pages/static/static.module').then(m => m.StaticModule) },

      // Anything else will route to not found
      { path: '**', redirectTo: 'not-found' }
    ]
  }
];

@NgModule({
  imports: [ ContentRouterModule.forChild(routes) ],
  exports: [ ContentRouterModule ],
  providers: [ WelcomeBack, UserPreferences ]
})
export class NavRoutingModule {}
