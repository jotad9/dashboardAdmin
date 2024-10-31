import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnInit
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

  constructor(private usuarioService: UsuarioService) {}

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
    //La importación dinámica carga el módulo solo cuando se necesita, en este caso, después de que la vista del componente ha sido completamente inicializada. Esto asegura que el módulo se cargue y se ejecute en el momento adecuado, cuando el DOM está completamente disponible y listo para ser manipulado.
    import('flowbite').then(({ Modal }) => {
      const modalElement = document.getElementById('editUserModal');
      if (modalElement) {
        const modalOptions: ModalOptions = {};
        const modal = new Modal(modalElement, modalOptions);

        document.querySelectorAll('[data-modal-target="editUserModal"]')
          .forEach((triggerElement) => {
            triggerElement.addEventListener('click', (event) => {
              event.preventDefault();
              const userIndex = (triggerElement as HTMLElement).getAttribute(
                'data-user-index'
              )!;
              this.updateModalContent(userIndex);
              modal.show();
            });
          });
      } else {
        console.error('Elemento #editUserModal no encontrado');
      }
    });
  }

  updateModalContent(index: string | undefined) {
    if (index !== undefined) {
      const usuario = this.usuarios[parseInt(index, 10)];
      (document.getElementById('first-name') as HTMLInputElement).value =
        usuario.name;
      (document.getElementById('email') as HTMLInputElement).value =
        usuario.email;
      (document.getElementById('phone-number') as HTMLInputElement).value =
        usuario.phoneNumber;
      (document.getElementById('department') as HTMLInputElement).value =
        usuario.department;
    }
  }
}
