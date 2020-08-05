import React from 'react';

import whatsAppIcon from '../../assets/images/icons/whatsapp.svg';

import './styles.css';

function TeacherItem() {
    return(
        <article className="teacher-item">
            <header>
                <img src="https://avatars0.githubusercontent.com/u/5317336?s=460&u=d1626683ad41e8c5febd44a53a577ea27f0d48d7&v=4" alt="Fernando Vendramin"/>
                <div>
                    <strong>Fernando Vendramin</strong>
                    <span>Química</span>
                </div>
            </header>
            <p>
                Entusiasta das melhores tecnologias de química avançada. <br/>
                Apaixonado por explodir coisas em laboratórios de por mudar a vida das pessoas através de expericnecias.                        
            </p>
            <footer>
                <p>
                    Preço/hora
                    <strong>R$ 80,00</strong>
                </p>
                <button type="button">
                    <img src={whatsAppIcon} alt="Whatsapp"/>
                    Entrar em contato
                </button>
            </footer>
        </article>
    );
}

export default TeacherItem;