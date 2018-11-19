import { Component, AfterContentInit, AfterViewInit, OnDestroy, ContentChildren, QueryList, HostListener, Input } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ThemePalette } from '@angular/material/core'
import { RouterInkbarDirective } from '../router-inkbar/router-inkbar.directive';
import { Subscription } from 'rxjs';
import { filter, delay } from 'rxjs/operators';

import { inkbarPosition } from '../inkbar/inkbar.component';

@Component({
  selector: 'wm-router-inkbar',
  templateUrl: './router-inkbar.component.html',
  styleUrls: ['./router-inkbar.component.scss']
})
export class RouterInkbarComponent implements AfterViewInit, AfterContentInit, OnDestroy {

  // Query for RouterInkbarDirective children
  @ContentChildren(RouterInkbarDirective, {descendants: true})
  readonly links: QueryList<RouterInkbarDirective>;

  @Input() height = 2;

  @Input() color: ThemePalette;

  constructor(private router: Router) { }

  private sub: Subscription;

  ngAfterContentInit() {

    // Detects router navigation end event to trigger inkbar animation
    this.sub = this.router.events
      .pipe( 
        // Filters navigation end events
        filter((s: RouterEvent) => s instanceof NavigationEnd), 
        // Delays the action on the next scheduler round
        delay(0),
      ).subscribe( () =>  this.updateInkbar() );
  }

  ngAfterViewInit() {
    // Draws the inkbar at start-up after view initialization
    setTimeout( () => this.updateInkbar() );
  }

  ngOnDestroy() {

    this.sub.unsubscribe();
  }

  public inkbar: inkbarPosition = { left: 0, width: 0 };

  @HostListener('window:resize') 
  private updateInkbar() {

    // Search for the active link
    const activeLink = this.links.find( link => link.isActive );
    
    // Update the inkbar position accordinly
    this.inkbar = !!activeLink ? activeLink.inkbarPosition : { width: 0 };
  }

}
