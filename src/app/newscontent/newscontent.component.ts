import { Component , Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-newscontent',
  templateUrl: './newscontent.component.html',
  styleUrls: ['./newscontent.component.css']
})
export class NewscontentComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<NewscontentComponent>) {console.log(data);}
 
  shareOnTwitter() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(this.data.headline)}&url=${encodeURIComponent(this.data.url)}`;
    window.open(url, '_blank');
  }

  shareOnFacebook() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.data.url)}`;
    window.open(url, '_blank');
  }
}
