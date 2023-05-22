import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * Trial Product Service, manages the items associated with a treatment.
 * Serves multiple components.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  /**Holds all products referenced in a given treatment. */
  products: any[];
  /**Holds the filtered selection of items when filters are applied. */
  filteredItems: any;
  /**Holds the subselection either based on this.products or this.filteredItems. */
  subSelection: any;

  constructor(private http: HttpClient) { }

  /**
   * Overwrites central product reference. 
   * @param products 
   */
  resetProducts(products) {
    this.products = products;
  }

  /**
   * Return all products placed into memory.
   * @returns {Observable}
   */
  getAllProducts() {
    return new Observable((sub) => {
      sub.next(this.products);
    })
    // not used anymore
    // return new Observable((sub) => {
    //   const id = sessionStorage.getItem('treatmentID')
    //   if (id) {
    //     this.http.get(environment.apiURI + '/t/' + id).subscribe((val: any[]) => {
    //       this.products = val;
    //       sub.next(this.products);
    //     });
    //   } else {
    //     this.http.get(environment.apiURI + '/allItems').subscribe((val: any[]) => {
    //       this.products = val;
    //       sub.next(this.products);
    //     });
    //   }
    // })
  }
  /**
   * Get specific product from all products based on product._id
   * @param {string} id
   * @returns {Promise} containing product 
   */
  getProduct(id: string): Promise<any> {
    // if not moliciously used id is noever not in this.pruducts
    return new Promise((resolve, reject) => {
      resolve(this.products.find(item => item._id === id));
    });
  }

  /**
   * Called by item grid if displayed items are filtered.
   * 
   * possible filter types: 'filterTree', 'tagFilter', 'limitSelection'
   * - filterTree filters by array of productIDs /itemIDs.
   * - tagFilter filters by tag specification (product.tags contains selected tag).
   * - limitSelection checks if already a filtered selection and subselects based on item.baseAttributes contains string.
   * 
   * @param {Array} filter 
   * @param {string} type
   * @returns {Array} of items representing a subset of all products matching filter. 
   */
  getItemsBasedOnFilter(filter: any, type) {
    if (type == 'filterTree') {
      this.filteredItems = [];
      filter.forEach(filterItem => {
        this.filteredItems.push(
          // checks for old IDs and the product ids ... maybe sometimes items twice or included that should not be
          this.products.filter(x => (x._id == filterItem || x.oldID == filterItem || x.externalID == filterItem))[0]
        );
      });
    } else if (type == 'limitSelection') {
      this.subSelection = [];
      if (this.filteredItems < 1) { this.filteredItems = [...this.products] }
      this.filteredItems.forEach(element => {
        if (element.baseAttributes != null && element.baseAttributes.some(val => filter.includes(val))) {
          this.subSelection.push(element);
        }
      });
      return this.subSelection;
    } 
   else if (type == 'tagFilter') {
    this.filteredItems = [];
    this.products.forEach((item) => {
      if (item.tags.includes(filter)) {
        this.filteredItems.push(item);
      }
    })
  } else {
      // free text search filter
      this.filteredItems = [];
      this.products.forEach((item) => {
        // for name and brand?
        filter.forEach(word => {
          if (item.name.toLowerCase().includes(word) || item.brand.toLowerCase().includes(word)) {
            this.filteredItems.push(item);
          }
        });
      });
    }
    return this.filteredItems;
  }

  /**
   * Base Function: Generates Filter based on tags array on products.
   * 
   * For this to work there need to be items with a tag array (product.tags representing categories).
   * Tags / categories in this array must be sorted from general to specific.
   * Now only supports tag sorting generation two levels deep.
   * e.g.: ['Lebenmittel', 'Brot', 'Vollkorn'] only first two entries would be selectable and visible in filter component.
   */
getTreeOfTagsOfAllProducts(): any[] {
  // Check if products are not empty
  if (!this.products) {
    return [];
  }

  // Get all tags from the products and filter out any products without tags
  const mokData: string[][] = this.products
    .filter(p => p.tags.length > 0)
    .map(p => p.tags);

  // Create an array to hold all branches (name and parent) from the tags
  const branches: { name: string, parent: string | null }[] = [];
  mokData.forEach(tags => {
    for (let i = 0; i < tags.length; i++) {
      // Create an object with the name of the current tag and its parent tag
      const obj: { name: string, parent: string | null } = {
        name: tags[i],
        parent: i === 0 ? null : tags[i - 1]
      };
      // Check if the branch already exists in the array before pushing it
      if (!branches.some(x => x.name === obj.name)) {
        branches.push(obj);
      }
    }
  });

  // Sort the branches by name
  branches.sort((a, b) => a.name.localeCompare(b.name));

  // Create an array to hold all trees (name and children)
  const trees: { name: string, children: any[] }[] = [];

  // Build the root of each tree
  branches.forEach(branch => {
    // If the branch has no parent, it's a root
    if (branch.parent === null) {
      trees.push({
        name: branch.name,
        children: []
      });
    }
  });

  // Build the children for each tree
  branches.forEach(branch => {
    // If the branch has a parent, find its parent tree and add it as a child
    if (branch.parent !== null) {
      const parentTree = trees.find(tree => tree.name === branch.parent);
      if (parentTree) {
        parentTree.children.push({
          name: branch.name,
          children: []
        });
      }
    }
  });

  return trees;
}


  /**
   * Base Funtion: Limit selection based on baseAttributes of items / products.
   * 
   * Gets all products.baseAttributes in a set (no duplicate entries).
   * @returns {array<string>} of strings 
   */
  getBaseAttributes() {
    let baseAttributes = new Set();
    for (let p of this.products) {
      if (p.baseAttributes != null && p.baseAttributes.length > 0) {
        for (let attr of p.baseAttributes) {
          baseAttributes.add(attr);
        }
      }
    }
    return [...baseAttributes];
  }
}
