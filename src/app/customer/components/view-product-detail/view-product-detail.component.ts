import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../service/customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserStorageService } from 'src/app/service/storage/user-storage.service';

@Component({
  selector: 'app-view-product-detail',
  templateUrl: './view-product-detail.component.html',
  styleUrls: ['./view-product-detail.component.scss']
})
export class ViewProductDetailComponent {

  productId: number = this.activatedRoute.snapshot.params["productId"];

  product: any;
  FAQS: any[] = [];
  reviews: any[] = [];

  constructor(private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
  ){}

  ngOnInit(){
    this.getProductDetailById();
  }

  getProductDetailById(){
    this.customerService.getProductDetailById(this.productId).subscribe(res => {
      this.product = res.productDto;
      this.product.processedImg = 'data:image/png;base64,' + res.productDto.byteImg;
      this.FAQS = res.faqDtoList;
      res.reviewDtoList.forEach(element => {
        element.processedImg = 'data:image/png;base64,' + element.returnedImg;
        this.reviews.push(element);
      })
    })
  }

  addToWishlist(){
    const wishlistDto = {
      productId: this.productId,
      userId: UserStorageService.getUserId()
    }
    this.customerService.addProductToWishList(wishlistDto).subscribe(res => {
      if(res.id != null){
        this.snackBar.open("Product added to wishlist successfully", "Close", {
          duration: 5000
        });
      }else{
        this.snackBar.open("Already in wishlist", "ERROR", {
          duration: 5000
        });
      }
    })
  }

}
