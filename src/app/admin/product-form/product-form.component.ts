import { Component, OnInit } from '@angular/core';
import {CategoryService} from '../../service/category.service';
import {AngularFireList} from 'angularfire2/database';
import {Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProductService} from '../../service/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Product} from '../../../models/product';


@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  categories$: Observable<any[]>;
  product$: Observable<any>;
  productForm: FormGroup;
  isSubmit = false;
  product: Product;
  productId: string;

  constructor(private categoryService: CategoryService,
              private formBuilder: FormBuilder,
              private productService: ProductService,
              private router: Router,
              private route: ActivatedRoute) {

    this.categories$ = categoryService.getListCategories()
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            return ({ key: a.key, ...a.payload.val() });
          })
        ));

    // This method will return node's key and node's value are compied
    /*this.categoryService.getListCategories().snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          console.log('a', a.key);
          console.log('payload', a.payload.val());
          return ({ key: a.key, ...a.payload.val() });
        })
      )
    ).subscribe(items => {
      console.log('items', items)
      return items.map(item => {
        console.log('item', item);
        return item.key;
      });
    });*/

    // This function will return all the node's value
    /*this.categoryService.getListCategories()
      .valueChanges()
      .subscribe(data => {
        console.log('data', data);
      });*/

  }

  get title() {
    return this.productForm.get('title');
  }
  get price() {
    return this.productForm.get('price');
  }
  get category() {
    return this.productForm.get('category');
  }
  get imageURL() {
    return this.productForm.get('imageURL');
  }

  ngOnInit() {
    this.productForm = this.initProductForm();

    this.productId = this.route.snapshot.paramMap.get('id');

    if (this.productId === 'new') {
      console.log('dont call', this.productId);
    } else {
      console.log('call', this.productId);
      this.productService.getProduct(this.productId).subscribe( (product: Product) => {
        console.log('log here');
        this.product = product;
      });
    }

  }

  submitProductForm() {
    let product = this.productForm.value;
    console.log('[ProductFormComponent][submitProductForm()] form product value:', product);
    this.isSubmit = true;

    console.log('debug', this.productForm);

    if (this.productForm.valid) {
      this.isSubmit = false;

      if (this.productId === 'new') {
        this.productService.createProduct(product);
      } else {
        this.productService.updateProduct(this.productId, product);
      }

      this.router.navigate(['admin/products']);
    }
  }

  initProductForm() {
    return this.formBuilder.group({
      title: ['', [
        Validators.required
      ]],
      price: ['', [
        Validators.required
      ]],
      category: ['', [
        Validators.required
      ]],
      imageURL: ['', [
        Validators.required
      ]]
    });
  }

  deleteProduct() {
    if (!confirm('Are you sure?')) return;

    this.productService.deteleProduct(this.productId);
    this.router.navigate(['admin/products']);

  }

}
