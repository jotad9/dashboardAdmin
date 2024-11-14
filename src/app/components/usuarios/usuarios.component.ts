import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Modal, ModalOptions } from 'flowbite';
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
  dismissModal: any = null;
  createMemberModal: any = null;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    console.log('UsuariosComponent cargado');
    this.usuarioService.getUsers().subscribe({
      next: (response) => {
        this.usuarios = response;
        setTimeout(() => {
          this.addEventListeners();
        }, 0);
      },
      error: (error) => console.error('Error fetching data', error),
    });
    console.log(this.usuarios);
  }
  openCreateMemberModal(): void {
    this.createMemberModal.show();
  }
  addEventListeners(): void {
    document
      .querySelectorAll('[data-modal-target="editUserModal"]')
      .forEach((triggerElement) => {
        console.log("triggerElement:", triggerElement);
        triggerElement.addEventListener('click', (event) => {
          event.preventDefault();
          const userIndex = (triggerElement as HTMLElement).getAttribute('data-user-index')!;
          console.log('Indice de usuario:', userIndex);
          this.updateModalContent(userIndex);
          this.modal.show();
        });
      });
  }
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
        const modalElement = document.getElementById('editUserModal');
        console.log("editUserModal encontrado:", modalElement);
        if (modalElement) {
          const modalOptions: ModalOptions = {};
          this.modal = new Modal(modalElement, modalOptions);
        } else {
          console.error('Elemento #editUserModal no encontrado');
        }

        const dismissModalElement = document.getElementById(
          'despedirUsuarioModal'
        );
        if (dismissModalElement) {
          const modalOptions: ModalOptions = {};
          this.dismissModal = new Modal(dismissModalElement, modalOptions);
        } else {
          console.error('Elemento #despedirUsuarioModal no encontrado');
        }

        const createMemberModalElement =
          document.getElementById('createMemberModal');
        if (createMemberModalElement) {
          const modalOptions: ModalOptions = {};
          this.createMemberModal = new Modal(
            createMemberModalElement,
            modalOptions
          );
          document
            .querySelectorAll('[data-modal-target="createMemberModal"]')
            .forEach((triggerElement) => {
              triggerElement.addEventListener('click', (event) => {
                event.preventDefault();
                this.createMemberModal.show();
              });
            });
        } else {
          console.error('Elemento #createMemberModal no encontrado');
        }
    }
  }

  updateModalContent(index: string | undefined) {
    if (index !== undefined) {
      const usuario = this.usuarios[parseInt(index, 10)];
      this.selectedUser = { ...usuario }; // Clonar el usuario seleccionado
      console.log('Usuario seleccionado:', this.selectedUser);
      (document.getElementById('name') as HTMLInputElement).value =
        usuario.nombre;
      (document.getElementById('email') as HTMLInputElement).value =
        usuario.email;
      (document.getElementById('position') as HTMLInputElement).value =
        usuario.position;
      (document.getElementById('salary') as HTMLInputElement).value =
        usuario.salary;
    }
  }

  saveUser() {
    if (this.selectedUser) {
      this.selectedUser.nombre = (
        document.getElementById('name') as HTMLInputElement
      ).value;
      this.selectedUser.email = (
        document.getElementById('email') as HTMLInputElement
      ).value;
      this.selectedUser.position = (
        document.getElementById('position') as HTMLInputElement
      ).value;
      this.selectedUser.salary = (
        document.getElementById('salary') as HTMLInputElement
      ).value;
      this.selectedUser.password = (
        document.getElementById('current-password') as HTMLInputElement
      ).value;

      this.usuarioService.updateUser(this.selectedUser).subscribe({
        next: (response) => {
          console.log('Usuario actualizado', response);
          // Actualizar la lista de usuarios con la información actualizada
          const index = this.usuarios.findIndex(
            (u) => u.id === this.selectedUser.id
          );
          if (index !== -1) {
            this.usuarios[index] = this.selectedUser;
            this.modal.hide();
          }
        },
        error: (error) => console.error('Error updating user', error),
      });
    }
  }

  opendismissModal(index: number) {
    this.selectedUser = this.usuarios[index];
    if (this.selectedUser && this.selectedUser.id) {
      this.dismissModal.show();
    } else {
      console.error('Usuario seleccionado no tiene un ID válido');
    }
  }

  despedir() {
    if (this.selectedUser && this.selectedUser.id) {
      this.usuarioService.deleteUser(this.selectedUser.id).subscribe({
        next: () => {
          console.log('Usuario despedido');
          const index = this.usuarios.findIndex(
            (u) => u.id === this.selectedUser.id
          );
          if (index !== -1) {
            this.usuarios.splice(index, 1); // Elimina el usuario del array
          }
          this.closeModal();
        },
        error: (error) => console.error('Error deleting user', error),
      });
    }
  }
  closeModalEdit() {
    this.modal.hide();
  }
  closeModalMember() {
    this.createMemberModal.hide();
  }
  closeModal() {
    this.dismissModal.hide();
  }

  createMember() {
    const newMember = {
      nombre: (document.getElementById('nameM') as HTMLInputElement).value,
      image_url: (document.getElementById('image') as HTMLInputElement).value,
      status: (document.getElementById('status') as HTMLInputElement).value,
      email: (document.getElementById('emailM') as HTMLInputElement).value,
      position: (document.getElementById('positionM') as HTMLInputElement)
        .value,
      salary: (document.getElementById('salaryM') as HTMLInputElement).value,
      password: (document.getElementById('new-passwordM') as HTMLInputElement)
        .value,
    };
    this.usuarioService.createUser(newMember).subscribe({
      next: (response) => {
        console.log('Usuario creado', response);
        this.usuarios.push(newMember);
        this.createMemberModal.hide();
      },
      error: (error) => console.error('Error creating user', error),
    });
  }
}
