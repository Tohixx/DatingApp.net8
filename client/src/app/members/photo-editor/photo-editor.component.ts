import { Component, inject, input, OnInit, output } from '@angular/core';
import { Member } from '../../_models/member';
import { DecimalPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { AccountService } from '../../_services/account.service';
import { environment } from '../../../environments/environment';
import { MemberCardComponent } from '../member-card/member-card.component';
import { MembersService } from '../../_services/members.service';
import { Photo } from '../../_models/photo';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [NgIf, NgFor, NgStyle, NgClass, FileUploadModule, DecimalPipe],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent implements OnInit{

  private memberService = inject(MembersService)
  private accountService = inject(AccountService);
  member = input.required<Member>();
  uploader?: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  memberChange = output<Member>();

  ngOnInit(): void {
    this.initializeUploader();
  }

// Called by the template when file is dragged over drop-zone
  fileOverBase(e: any){
    this.hasBaseDropZoneOver = e;
  };

  // Deletes a photo by ID and updates the member's photo list on success
  deletePhoto(photo: Photo){
    this.memberService.deletePhoto(photo).subscribe({
      next: _ => {
        const updatedMember = {...this.member()}; // Copy current member
        updatedMember.photos = updatedMember.photos.filter(x => x.id !== photo.id); // Remove photo
        this.memberChange.emit(updatedMember); // Emit updated member
      }
    })
  }

  setMainPhoto(photo: Photo){
    this.memberService.setMainPhoto(photo).subscribe({
      next: _ => {
        const user = this.accountService.currentUser();
        if (user){
          user.photoUrl = photo.url;
          this.accountService.setCurrentUser(user);
        }
        const updatedMember = {...this.member()}
        updatedMember.photoUrl = photo.url;
        updatedMember.photos.forEach(p =>{
          if (p.isMain) p.isMain = false;
          if (p.id === photo.id) p.isMain = true;
        });
        this.memberChange.emit(updatedMember);
      }
    })
  }

// Configure the FileUploader instance
  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',              // API endpoint
      authToken: 'Bearer ' + this.accountService
                                  .currentUser()?.token, // Attach JWT for auth
      isHTML5: true,                                     // Use HTML5 File API
      allowedFileType: ['image'],                        // Only images
      removeAfterUpload: true,                           // Clear file after upload
      autoUpload: false,                                 // Wait for manual trigger
      maxFileSize: 10 * 1024 * 1024                      // 10 MB limit
    });

    // Disable credentials so CORS won’t include cookies
    this.uploader.onAfterAddingAll = (file) => {
      file.withCredentials = false
    }

    this.uploader.onSuccessItem = (item, response, status, headers) =>{
      const photo = JSON.parse(response);
      const updateMember = {...this.member()};
      updateMember.photos.push(photo);
      this.memberChange.emit(updateMember);
    }
  }
}
