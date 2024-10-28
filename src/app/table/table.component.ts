import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Modal } from 'flowbite';
import type { ModalOptions, ModalInterface } from 'flowbite';

@Component({
  selector: 'app-table',
  standalone: true,
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements AfterViewInit {
  $modalElement: HTMLElement | null = null;
  modal: ModalInterface | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      import('flowbite').then(({ Modal }) => {
        this.$modalElement = document.getElementById('editUserModal');
        if (this.$modalElement) {
          const modalOptions: ModalOptions = {};
          this.modal = new Modal(this.$modalElement, modalOptions);

          const triggerElement = document.querySelector('[data-modal-show="editUserModal"]');
          if (triggerElement) {
            triggerElement.addEventListener('click', (event) => {
              event.preventDefault();
              this.modal?.show();
            });
          } else {
            console.error('Elemento con data-modal-show="editUserModal" no encontrado');
          }
        } else {
          console.error('Elemento #editUserModal no encontrado');
        }
      });
    }
  }
}
