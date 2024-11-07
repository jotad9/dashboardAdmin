import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { ModalOptions } from 'flowbite';
import { UsuarioService } from '../../services/usuario.service';
@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements AfterViewInit, OnInit {
  //modal de la tabla
  $modalElement: HTMLElement | null = null;
  usuarios: any[] = [];
  selectedUser: any = null;
  modal: any = null;
  despedirModal: any = null;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    console.log('UsuariosComponent cargado');
    this.usuarioService.getUsers().subscribe({
      next: (response) => {
        this.usuarios = response;
      },
      error: (error) => console.error('Error fetching data', error),
    });
    console.log(this.usuarios);
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      import('flowbite').then(({ Modal }) => {
        const modalElement = document.getElementById('editUserModal');
        if (modalElement) {
          const modalOptions: ModalOptions = {};
          this.modal = new Modal(modalElement, modalOptions);

          document.querySelectorAll('[data-modal-target="editUserModal"]')
            .forEach((triggerElement) => {
              triggerElement.addEventListener('click', (event) => {
                event.preventDefault();
                const userIndex = (triggerElement as HTMLElement).getAttribute(
                  'data-user-index'
                )!;
                this.updateModalContent(userIndex);
                this.modal.show();
              });
            });
        } else {
          console.error('Elemento #editUserModal no encontrado');
        }

        const despedirModalElement = document.getElementById('despedirUsuarioModal');
        if (despedirModalElement) {
          const modalOptions: ModalOptions = {};
          this.despedirModal = new Modal(despedirModalElement, modalOptions);
        } else {
          console.error('Elemento #despedirUsuarioModal no encontrado');
        }
      });
    }
  }

  updateModalContent(index: string | undefined) {
    if (index !== undefined) {
      const usuario = this.usuarios[parseInt(index, 10)];
      this.selectedUser = { ...usuario }; // Clonar el usuario seleccionado
      (document.getElementById('name') as HTMLInputElement).value = usuario.nombre;
      (document.getElementById('email') as HTMLInputElement).value = usuario.email;
      (document.getElementById('position') as HTMLInputElement).value = usuario.position;
      (document.getElementById('salary') as HTMLInputElement).value = usuario.salary;
      (document.getElementById('current-password') as HTMLInputElement).value = usuario.password;
    }
  }

  saveUser() {
    if (this.selectedUser) {
      this.selectedUser.nombre = (document.getElementById('name') as HTMLInputElement).value;
      this.selectedUser.email = (document.getElementById('email') as HTMLInputElement).value;
      this.selectedUser.position = (document.getElementById('position') as HTMLInputElement).value;
      this.selectedUser.salary = (document.getElementById('salary') as HTMLInputElement).value;
      this.selectedUser.password = (document.getElementById('current-password') as HTMLInputElement).value;

      this.usuarioService.updateUser(this.selectedUser).subscribe({
        next: (response) => {
          console.log('Usuario actualizado', response);
          // Actualizar la lista de usuarios con la información actualizada
          const index = this.usuarios.findIndex(u => u.id === this.selectedUser.id);
          if (index !== -1) {
            this.usuarios[index] = this.selectedUser;
          }
        },
        error: (error) => console.error('Error updating user', error),
      });
    }
  }

  openDespedirModal(index: number) {
    this.selectedUser = this.usuarios[index];
    this.despedirModal.show();
  }

  despedir() {
    if (this.selectedUser) {
      this.usuarioService.deleteUser(this.selectedUser.id).subscribe({
        next: () => {
          console.log('Usuario despedido');
          const index = this.usuarios.findIndex(u => u.id === this.selectedUser.id);
          if (index !== -1) {
            this.usuarios.splice(index, 1); // Elimina el usuario del array
          }
          this.closeModal();
        },
        error: (error) => console.error('Error deleting user', error),
      });
    }
  }
  closeModalEdit(){
    this.modal.hide();
  }
  closeModal() {
    this.despedirModal.hide();
  }
}
