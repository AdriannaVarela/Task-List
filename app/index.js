// selectores. documento todo el html. queryselector es para seleccionar en especifico.
const form = document.querySelector("#main-form");
const nameInput = document.querySelector("#name-input");
const phoneInput = document.querySelector("#phone-input");
const mainFormBtn = document.querySelector("#main-form-btn");
const contactsList = document.querySelector("#contacts-list")

console.log(form, nameInput, phoneInput, mainFormBtn);

const NAME_REGEX = /^[A-Z]{1}[a-z]*[ ][A-Z]{1}[a-z]*$/;
const PHONE_REGEX = /^(0212|0412|0424|0414|0426|0416)[0-9]{7}$/;

let nameInputValidation = false
let phoneInputValidation = false

//contactos
const contacsManagerInit = () => {
    let contacts = [];
    const publicAPI = {
        getContacts: () => {
            return contacts;
        },
        //JSDOC
        /**
         * Agrega un nuevo contacto.
         * @param {Object} newContact - El contacto  a agregar.Agrega
         * @param {string} newContact.id - El id del contacto. 
         * @param {string} newContact.name - El nombre del contacto.
         * @param {string} newContact.phone - El telefono del contacto.
         * @returns void.
         */
        addContac: (newContac) => {
            contacts = contacts.concat(newContac);
            console.log('Guardado el nuevo contacto!')
        },
        saveInBrowser: () => {
            localStorage.setItem('contactsList', JSON.stringify(contacts));
            console.log('Guardado en el navegador!');
        },
        replaceContacts: (localContacts) => {
            contacts = localContacts;
        },

        renderContacts: ()=> {
            //borrar el contenido de la lista
            contactsList.innerHTML = '';
            // console.log(contacts)
            console.log('renderContacts')

            //crear un bucle
            contacts.forEach(contacts => {
                //2acceder a cada contacto
                // console.log(contacts);

                //3 crear un li para cada contacto
                const ListItem = document.createElement('li');
                ListItem.classList.add('contacts-list-item');
                ListItem.id = contacts.id;

                //4 crear la estructurra para cada li
                ListItem.innerHTML = `<div class="inputs-container">
            <input class="contacts-list-item-name-input" type="text" value="${contacts.name}" readonly>
            <input class="contacts-list-item-phone-input" type="text" value="${contacts.phone}" readonly>
        </div>
        <div class="btns-container">
            <button class="edit-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            </button>
            <button class="delete-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            </button>
        </div>`;

                //5 agregar el li a la ul (como un hijo)
                contactsList.append(ListItem);

            })
            
            
        },
        deleteContacts: (id) => {
            contacts = contacts.filter(contact => {
                if (id !== contact.id) {
                    return contact;
                }
            });
        },
        editContact: (editedContact) => {
            contacts = contacts.map(contacts => {
                if (editedContact.id === contacts.id) {
                    return editedContact;
                } else {
                    return contacts;
                }
            })
        }
    }
    return publicAPI;
}
const contactsManager = contacsManagerInit();

const checkValidations = () => {
    if (nameInputValidation && phoneInputValidation) {
        mainFormBtn.disabled = false;
    } else {
        mainFormBtn.disabled = true;
    }
}

// Funcion que añade color al borde y el texto del input
const validateInput = (input, validation) => {
    const helpText = input.parentElement.children[2];
    
    if (input.value === "") {
        input.classList.remove("valid");
        input.classList.remove("invalid");
        helpText.classList.remove("invalidText");
        helpText.classList.add("hidden");
    } else if (validation) {
        input.classList.add("valid");
        input.classList.remove("invalid");
        helpText.classList.remove("invalidText");
        helpText.classList.add("hidden");
    } else {
        input.classList.add("invalid");
        input.classList.remove("valid");
        helpText.classList.add("invalidText");
        helpText.classList.remove("hidden");
    }
};
//evento: Input
nameInput.addEventListener('input', e => {
    nameInputValidation = NAME_REGEX.test(nameInput.value);
    validateInput(nameInput, nameInputValidation)
    checkValidations();
});

phoneInput.addEventListener('input', e => {
    phoneInputValidation = PHONE_REGEX.test(phoneInput.value);
    validateInput(phoneInput, phoneInputValidation)
    checkValidations();
});
//PATRONES DE DISENO
form.addEventListener('submit', (e) => {
    console.log('Anadiendo contacto...');
    //Elimino la funcionalidad por defecto del formulario
    e.preventDefault();

    //Validando que ambas validaciones osn correctas
    if (!nameInputValidation || !phoneInputValidation) return;
    console.log('Contacto validado correctamente');

    //creo el nuevo contacto
    console.log('Creando el objeto del contacto...');
    const newContact = {
        id: crypto.randomUUID(),
        name: nameInput.value,
        phone: phoneInput.value,
    }

    console.log('Objeto del contacto creado', newContact);

    //Anado el contacto al array
    console.log('Anadiendo contacto...')
    contactsManager.addContac(newContact);

    //Guardo los contactos en el navegador
    console.log('Anadiendo contactos al navegador')
    contactsManager.saveInBrowser();

    //mostrar en el html
    console.log('mostrando en el html...')
    contactsManager.renderContacts();
});
//Este evento se ejecuta cada vez que se detecta un click en la lista de contactos
contactsList.addEventListener('click', e => {
    //Selecciono el boton de eliminar
    //Target es para seleccionar el elemento o div que se esta clickeando
    //Closest es para que al seleccionar cualquier elemento hijo de delete-btn se seleccione directamente delete-btn
    const deleteBtn = e.target.closest('.delete-btn');
    //Lo mismo que lo anterior pero con una clase diferente
    const editBtn = e.target.closest('.edit-btn');

    //Si se clikea el boton de eliminar se empieza el proceso de eliminar
    if (deleteBtn) {
        //selecciono el li del boton clickeado
        const li = deleteBtn.parentElement.parentElement;
        //obtengo el id del li seleccionado
        const id = li.id;
        //Se elimina el contacto del array de contactos
        contactsManager.deleteContacts(id);
        //Se guarda el array actualizado en el navegador
        contactsManager.saveInBrowser();
        //Se renderiza el array sin e contacto eliminado
        contactsManager.renderContacts();
        
    }
    if (editBtn) {
            //Selecciono el li
            const li = editBtn.parentElement.parentElement;
            //Selecciono ambos inputs
            const nameImputEdit = li.children[0].children[0];
            const phoneImputEdit = li.children[0].children[1];

            let editNameValidation = false;
            let editPhoneValidation = false;
            editNameValidation = NAME_REGEX.test(nameImputEdit.value);
            editPhoneValidation = PHONE_REGEX.test(phoneImputEdit.value);

            if (!editPhoneValidation && editBtn.classList.contains('editando')) {
                phoneImputEdit.classList.add('invalidEdit');
            } else {
                phoneImputEdit.classList.remove('invalidEdit');
            }

            if (!editNameValidation  && editBtn.classList.contains('editando')) {
                nameImputEdit.classList.add('invalidEdit');
            } else {
                nameImputEdit.classList.remove('invalidEdit');
            }

            //Se evalua si la validacion del nombre y el numero son correctas y si el btn tiene agragada la clase editando
            if (editNameValidation && editPhoneValidation && editBtn.classList.contains('editando')) {
                //Si el btn tiene la clase editando se le remueve
                editBtn.classList.remove('editando');
                //Anado el atributo readonly para no poder editar los contactos
                nameImputEdit.setAttribute('readonly', true);  
                phoneImputEdit.setAttribute('readonly', true);
                nameImputEdit.classList.remove('edit');
                phoneImputEdit.classList.remove('edit');
                
            //Creo el contacto editado usanado la informacion del html
            const contactEdited = {
                id: li.id,
                name: nameImputEdit.value,
                phone: phoneImputEdit.value
            }

            //Se crea un array con el nuevo contacto editado
            contactsManager.editContact(contactEdited);
            //Se guarda el array actualizado en el navegador
            contactsManager.saveInBrowser();
            //Se renderriza el array sin el contacto eliminado
            contactsManager.renderContacts();

            console.log('No esta editando');
        } else {
            //Se añade la clases editando al boton de edicion
            editBtn.classList.add('editando');
            //Se añade la clase edit a ambos imputs (name y phone)
            nameImputEdit.classList.add('edit');
            phoneImputEdit.classList.add('edit');
            //Remuevo el atributo readonly para poder editar los contactos
            nameImputEdit.removeAttribute('readonly');
            phoneImputEdit.removeAttribute('readonly');
            
            console.log('Esta editando');
        }
    }
});

window.onload = () => {
    //obtengo los contactos de local storage
    const getContacsLocal = localStorage.getItem("contactsList");
    //paso los contactos de json a js
    const  contactsLocal = JSON.parse(getContacsLocal);
    if (!contactsLocal) {
        //Reemplazo los contactos con un array vacio
        contactsManager.replaceContacts([]);
    }else {
        //reemplazo el array de contactos guardados en el navegador
        contactsManager.replaceContacts(contactsLocal);
    }
    //muestro los ,contactos en el html
    contactsManager.renderContacts();
}