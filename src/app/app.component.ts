import { Component ,OnInit , } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterOutlet , Route} from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrarComponent } from "./components/registrar/registrar.component";
import { InicioComponent } from "./components/inicio/inicio.component";




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, RegistrarComponent, InicioComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'consultaOnline';


  form: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      // Adicione a lógica para agendar a consulta
      // Exemplo: this.agendaService.schedule(this.form.value).subscribe(...)
    }
  }

}
