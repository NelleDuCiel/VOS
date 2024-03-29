import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../trial-services/product.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FilterService } from '../trial-services/filter.service';
import { TrialTreatmentService } from '../trial-services/trial-treatment.service';
import { EventsService } from '../trial-services/events.service';
import { filter, take } from 'rxjs/operators';
import { RoutingTrackerService } from '../trial-services/routing-tracker.service';
import { Router } from '@angular/router';

/**
 * Central component that displays the item grid. 
 * Nested Components: app-food-card
 */
@Component({
  selector: 'app-item-grid',
  templateUrl: './item-grid.component.html',
  styleUrls: ['./item-grid.component.scss']
})
export class ItemGridComponent implements OnInit {
  /**Viewchild reference to paginator of item grid. */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  /**All products that are selected, either all, or subselection of all after filtering. */
  products: any[] = [];
  /**For reference, used in ngIf display reset filter tag at top of item grid.  */
  lengthProducts: number;
  /**Holds items for display in item grid, also supports slices for pagination. */
  dataSource: any;
  /**Names of sorting options for use in dropdown selection of sorting options. */
  filterOptions = ['Prijs oplopend', 'Prijs dalend', 'Nutri-Score'];
  /**Selection options for pagination. For dropdown seleciton of displayed products per page. */
  pageSizes = [5, 10, 20, 100];
  // show = false;
  /**Switch for displaying the whole item grid. */
  showGrid = false;
  /**Holds currently selected page size, can e overwritten by user specificaiton. */
  pageSize = this.trialTreatmentService.getDisplayOptions().numOfItems;
  /**Holds reference to the current page. */
  currentPage = 0;
  commonList: any = [];

  constructor(
    private productService: ProductService,
    private filterService: FilterService,
    private trialTreatmentService: TrialTreatmentService,
    private eventsService: EventsService,
    private routeTrackingService: RoutingTrackerService
  ) { }

  /**
   * 
   */
  ngOnInit() {
    this.products = [];
    if (this.filterService._getNavInfo() == undefined) { this.filterService._setNavInfo({ pageSize: this.pageSize, currentPage: this.currentPage }) }
    else {
      const navInfo = this.filterService._getNavInfo();
      // console.log(navInfo);
      this.currentPage = navInfo.currentPage;
      this.pageSize = navInfo.pageSize;
    }
    if (!this.filterService.selectedFilter) {
      this.productService.filteredItems = [];

      this.productService.getAllProducts().pipe(take(1)).subscribe((res: any) => {
        this.products = res;
        this.lengthProducts = this.products.length;
        this.setUp();
      })
    } 
    else {
      this.productService.filteredItems = [];
      this.filterService.allSelectedFilter.forEach(selectedFilter => {
        this.products = this.productService.getItemsBasedOnFilter(selectedFilter.filter, selectedFilter.type);
      });
      this.setUp()
    }

    this.productService.getAllProducts().pipe(take(1)).subscribe((res: any) => {
      this.products = res;
      this.lengthProducts = this.products.length;
    });
    this.filterService.filtered.subscribe((val) => {
      this.commonList = [];
      val.forEach(selectedFilter => {
        const newProducts = this.productService.getItemsBasedOnFilter(selectedFilter.filter, selectedFilter.type);
        this.commonList.push(...newProducts);
      });
      if (this.commonList.length > 1 && val.length > 1) {
        let filteredList = this.commonList.filter((obj, index, self) => {
          return self.filter(innerObj => innerObj._id === obj._id).length > 1;
        });
        filteredList = filteredList.filter((value, index, self) => self.findIndex((item) => item._id === value._id) === index)
        this.products = filteredList;
      }
      else {
        this.products = this.commonList;
      }
      this.setUp();
    });
    this.filterService.resetFilter.subscribe(() => {
      this.productService.getAllProducts().subscribe((val: any[]) => {
        this.products = val;
        this.setUp();
      })
    });
    this.eventsService.emitShowBack(false);
    // console.log(this.dataSource);
  }
  /**
   * Function handling the assignment of all necessary data for itemgrid display puposes.
   * Inturn call the iterator function that handles the pagination.
   * After this the item grid is displayes (showGrid = true).
   */
  setUp() {
    this.currentPage = 0;
    this.showGrid = false;
    this.dataSource = new MatTableDataSource<Element>();
    // Default sorting
    // this.products.sort((a, b) => a.niceness - b.niceness); // sort niceness ascending least nicest products first
    this.products.sort((a, b) => a.name.localeCompare(b.name)); // sort alphabetically
    this.dataSource.data = [...this.products];
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.length = this.dataSource.data.length;
    this.iterator();
    setTimeout(() => { this.showGrid = true; })
  }
  /**
   * Handles the paginator at the bottom of the item display grid.
   */
  iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.dataSource.data.slice(start, end);
    this.dataSource.slice = part;
    let ids = [];
    for (let i of part) {
      ids.push(i._id);
    }
    this.eventsService.paginationEvent({currentPage: this.currentPage, pageSize: this.pageSize, itemsOnPage: ids, numInTotal: this.dataSource.data.length})
  }
  /**
   * Page event listener of the mat-paginator tag.
   * Sets navInfo in filter Service.
   * Invoces the iterator function to handle page changes.
   * @param e 
   */
  handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.filterService._setNavInfo({ pageSize: this.pageSize, currentPage: this.currentPage })
    this.iterator();
    // if (!this.show) {
    //   this.show = true;
    // }
    window.scroll(0, 0);
  }
  /**
   * Listener for selectionChange event on mat-select tag.
   * Handles all three displayd options (reset, ascending price, decinding price).
   * @param $event 
   */
  sortingSelection($event) {
    const filter = { filter: !$event.value ? 'reset' : $event.value, type: 'sorting' }
    this.eventsService.recordSorting(filter);
    if (!$event.value) {
      // this.dataSource.data.sort((a, b) => b.niceness - a.niceness);
      this.dataSource.data.sort((a, b) => a.name.localeCompare(b.name));
      this.iterator();
      return;
    }
    if ($event.value == 'Prijs oplopend') {
      this.dataSource.data.sort((a, b) => a.netPrice - b.netPrice);
      this.iterator();
      return;
    }
    if ($event.value == 'Prijs dalend') {
      this.dataSource.data.sort((a, b) => b.netPrice - a.netPrice);
      this.iterator();
      return;
    }
   if ($event.value == 'Nutri-Score') {
		  this.dataSource.data.sort((a, b) => {
        const scoreA = a.score.amount;
        const scoreB = b.score.amount;
        return scoreA - scoreB;
      });
		  this.iterator();
		  return;
    }   
  }
  /**
   * Function that handles the logic for reseting all filters applied.
   * @emits resetFilter Event.
   */
  resetFilter() {
    const filter = { filter: 'reset', type: 'general' }
    // this.eventsService.recordSorting(filter);
    this.productService.filteredItems = [];
    this.filterService.resetFilterEmit();
  }

  get filtered() {
    return this.filterService.itemsFiltered;
  }
}
