import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import type { ModalOptions } from 'flowbite';
import { UsuarioService } from '../../services/usuario.service';
@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements AfterViewInit, OnInit {
  //modal de la tabla
  $modalElement: HTMLElement | null = null;
  private modal: any;
  usuarios: any[] = [];
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private usuarioService:UsuarioService) {}
  ngOnInit(): void {
    console.log('UsuariosComponent cargado');
    this.usuarioService.getUsers().subscribe({
      next: (response) =>{
        this.usuarios = response,
        console.log('Data fetched', this.usuarios)
      },
      error: (error) => console.error('Error fetching data', error)
    });
    console.log(this.usuarios);
  }

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
