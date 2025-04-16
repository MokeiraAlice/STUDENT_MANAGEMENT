import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  fileName: string = '';
  fileDescription: string = '';
  fileCategory: string = '';
  uploadProgress: number = 0;
  uploading: boolean = false;
  uploadSuccess: boolean = false;
  uploadError: boolean = false;
  errorMessage: string = '';
  isDragging: boolean = false;
  
  constructor(private fileUploadService: FileUploadService) {}
  
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.fileName = this.selectedFile.name;
      this.resetStatus();
    }
  }
  
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }
  
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }
  
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
      this.fileName = this.selectedFile.name;
      this.resetStatus();
    }
  }
  
  uploadFile(): void {
    if (!this.selectedFile || !this.fileDescription || !this.fileCategory) {
      return;
    }
    
    this.resetStatus();
    this.uploading = true;
    
    this.fileUploadService.uploadFile(
      this.selectedFile, 
      this.fileDescription, 
      this.fileCategory
    ).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.uploading = false;
          this.uploadSuccess = true;
          setTimeout(() => this.resetForm(), 3000);
        }
      },
      error: (error: any) => {
        this.uploading = false;
        this.uploadError = true;
        this.errorMessage = error.error?.message || 'An error occurred during upload';
        console.error('Upload failed', error);
      }
    });
  }
  
  resetForm(): void {
    this.selectedFile = null;
    this.fileName = '';
    this.fileDescription = '';
    this.fileCategory = '';
    this.resetStatus();
  }
  
  resetStatus(): void {
    this.uploadProgress = 0;
    this.uploading = false;
    this.uploadSuccess = false;
    this.uploadError = false;
    this.errorMessage = '';
  }
  
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}