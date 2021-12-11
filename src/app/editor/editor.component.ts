import { Component, OnInit, ViewChild } from '@angular/core';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, QuickToolbarService } from '@syncfusion/ej2-angular-richtexteditor';
import { FormControl, FormGroup,Validators  } from '@angular/forms';
import { NewsletterService } from '../services/newsletter.services';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass']
})
export class EditorComponent implements OnInit {
  @ViewChild('tituloEditor') tituloEditor: any;
  @ViewChild('selectedSubtituloEditor') selectedSubtituloEditor: any;
  @ViewChild('selectedTextoEditor') selectedTextoEditor: any;

  
  public items : any = [];
  public selectedItem : any = {};
  public cargando = false;
  public formulario = new FormGroup({
    asunto: new FormControl('',[Validators.required]),
    destinatario: new FormControl('',[Validators.required,Validators.email]),
    selectedImagen: new FormControl(''),
    textoBoton: new FormControl(''),
    urlBoton: new FormControl(''),
    cuitCliente: new FormControl('',Validators.required),
  });

  public tools: object = {
    type: 'MultiRow',
    items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
     'FontSize', 'FontColor', 'BackgroundColor',
    'LowerCase', 'UpperCase', '|',
    'CreateLink', '|', 'ClearFormat', 
    'SourceCode','|', 'Undo', 'Redo']
};
  constructor(public newsletterService: NewsletterService, private snackBar: MatSnackBar
    ) {
      
    }

  test(){
    alert(this.tituloEditor.getHtml());
  }
  
  addItem(){
    let textoSubtituloCount = this.selectedSubtituloEditor.getCharCount();
    let textoEditorCount = this.selectedTextoEditor.getCharCount();
    if(this.items.length == 0 && textoSubtituloCount == 0){
      this.snackBar.open("Ingrese el subtitulo del item","Ok")
    }
    else if(this.items.length == 0 && textoEditorCount == 0)
    {
      this.snackBar.open('Ingrese el texto del item',"Ok")

    }
    else{
      let contenido = {
        subtitulo : this.selectedSubtituloEditor.getHtml(),
        texto : this.selectedTextoEditor.getHtml(),
        
      }
      const newItem = {
        imagen: this.formulario.value.selectedImagen, 
        contenido: contenido,boton : {
        texto : this.formulario.value.textoBoton,
        url : this.formulario.value.urlBoton
      } }
      this.items = this.items.concat(newItem);
    }
   
  }

  
  ngOnInit(): void {
    
  }
  async sendMail(){
    if(this.items.length == 0){
      this.snackBar.open("Debe agregar al menos un item con el boton +","Ok")

    }
    else{
      this.cargando = true;
      if(this.formulario.invalid){
        this.snackBar.open("Hay campos sin completar","Ok")

      }
      else{
        let mailParams = {
          mailParams : {
            idCliente : this.formulario.value.cuitCliente,
            mailTo : this.formulario.value.destinatario,
            asunto : this.formulario.value.asunto,
            titulo : this.tituloEditor.getHtml(),
            items : this.items

  
          }
      }
      try{
        let response = await this.newsletterService.sendNewsLetter(mailParams);
        //alert(response); 
        this.cargando = false;
        this.snackBar.open("Mail enviado con éxito","Ok")

      }
      catch(exception : any){
        this.cargando = false;
        alert("Hubo un error inesperado " + exception.message);
      }
     
      }
      
         
  }

    }
    
}
