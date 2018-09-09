import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .init({
    // we init with resources
    detection: {
      // order and from where user language should be detected
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],

      // keys or params to lookup language from
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,

      // cache user language on
      caches: ['localStorage', 'cookie'],
      excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)

      // optional expire and domain for set cookie
      cookieMinutes: 10,
      cookieDomain: 'myDomain',

      // optional htmlTag with lang attribute, the default is:
      htmlTag: document.documentElement
    },
    resources: {
      en: {
        translations: {
          "Welcome to React.js": "Welcome to React.js",
          "Declarative": "Declarative",
          "React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.": "React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.",
          "Declarative views make your code more predictable and easier to debug.": "Declarative views make your code more predictable and easier to debug."
        }
      },
      el: {
        translations: {
          "Welcome to React.js": "Καλώς 'Ηρθατε στο React.js!",
          "Declarative": "Δηλωτικό",
          "React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.": "καθιστά ανώφελη τη δημιουργία διαδραστικών διεπαφών χρήστη. Σχεδιάστε απλές προβολές για κάθε κράτος στο δικό σας\\n\" +\n" +
          "                    εφαρμογή και το React θα ενημερώσει αποτελεσματικά και θα αποδώσει τα σωστά στοιχεία όταν τα δεδομένα σας " +
          "                    αλλαγές.",
          "Declarative views make your code more predictable and easier to debug.": "Οι δηλωτικές προβολές καθιστούν τον κώδικα πιο προβλέψιμο και πιο εύκολο στον εντοπισμό σφαλμάτων."
        }
      },
      it: {
        translations: {
          "WCCM Online Meditation Groups": "WCCM Gruppi di Meditazione Online",
          "Welcome to React.js": "Benvenuto in React.js",
          "Declarative": "Dichiarativo",
          "React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.": "React rende facile creare UI interattive. Disegna semplici viste per ogni stato della ta app, e React aggiornerà solo i componenti che devono essere aggiornati",
          "Declarative views make your code more predictable and easier to debug.": "Le viste dichiarative rendono il tuo codice più prevedibile e facile da debuggare."

        }
      },
      pt: {
        translations: {
          "WCCM Online Meditation Groups": "WCCM Grupos de Meditação Online",
          "Sign in": "Inscreva-se",
          "Filter by Language": "Filtrar por Idioma",
          "All": "Todos",
          "English": "Inglês",
          "French": "Francês",
          "Italian": "Italiano",
          "Spanish": "Espanhol",
          "German": "Alemão",
          "Dutch": "Holandês",
          "Russian": "Russo",
          "Portuguese": "Português",
          "Filter by Week Day": "Filtrar por Dia da Semana",
          "Monday": "Segunda-feira",
          "Tuesday": "Terça-feira",
          "Wednesday": "Quarta-feira",
          "Thursday": "Quinta-feira",
          "Friday": "Sexta-feira",
          "Saturday": "Sábado",
          "Sunday": "Domingo",
          "Group Type": "Tipos de Grupo",
          "Special Groups": "Grupos Especiais",
          "Reset Filters": "Limpar Filtros",
          "Language": "Idioma",
          "Group Info": "Informação do Grupo",
          "Group Leader": "Líder do Grupo",
          "Meeting Schedule[in your local time]": "Calendário do Grupo (no seu horário local)",
          "Join this group": "Participe deste grupo",
          "Close": "Fechar",
          "Username or email": "Nome de usuário ou email",
          "Password": "Senha",
          "Sign in": "Inscrever-se",
          "Forgot password": "Esqueci a senha",
          "Groups Pending Approval": "Grupos Pendentes de Aprovação",
          "Manage Groups": "Gerenciar Grupos",
          "Create New Group": "Criar Novo Grupo",
          "Groups You Created": "Grupos Criados",
          "Submit Group": "Submeter Grupo",
          "Edit Group": "Editar Grupo",
          "Groups changes saved": "Mudanças no grupo salvas",
          "Group changes saved successfully": "Mudanças no grupo salvas com sucesso",
          "Update Group": "Atualizar Grupo",
          "Delete Group": "Apagar grupo",
          "User Management": "Gerenciar Usuário",
          "Language": "Idioma",
          "Group Info": "Informação do Grupo",
          "Group Leader": "Líder do Grupo",
          "Meeting Time": "Horário dos Encontros",
          "Review group submission": "Revisar Submissão de Grupo",
          "Review": "Revisar",
          "Group language": "Idioma do grupo",
          "Group Detail": "Detalhes do Grupo",
          "URL to Detail Page": "Endereço de Página Informativa",
          "First name": "Primeiro nome",
          "Last name": "Sobrenome",
          "Email": "Email",
          "Phone": "Fone",
          "Country": "País",
          "Group Meeting Time": "Horário de Encontros do Grupo",
          "Group Meeting Day and Time": "Dia e Horário dos Encontros do Grupo",
          "Day of week": "Dia da semana",
          "Online Meeting Service Option": "Opção de Plataforma Online para Encontros",
          "This group needs to receive a link to a meeting room": "Este grupo precisa de um link de videoconferência para os encontros",
          "Approve Group": "Aprovar Grupo",
          "Create National Referent User": "Criar Usuário Nacional de Referência",
          "Full name": "Nome completo",
          "select country": "selecionar país",
          "email": "email",
          "Create User": "Criar Usuário",
          "Create Administrator User": "Criar Usuário Gestor",
          "Authorized Users": "Usuários Autorizados",
          "Meditator": "Meditante",
          "Roles": "Funções",
          "Time": "Horário",
          "Time Zone": "Fuso Horário",
          "Communication Permissions": "Permissões de Comunicação",
          "WCCM will use the information you provide on this form to be in touch with you and to provide updates and marketing. Please let us know that you would like to hear from us: I agree to be contacted by EMAIL You can change your mind at any time by clicking the unsubscribe link in the footer of any email you receive from us, or by contacting us at leonardo@wccm.org. We will treat your information with respect. For more information about our privacy practices please visit our website. By clicking below, you agree that we may process your information in accordance with these terms.": "WCCM usará a informação que você dará neste fomrulário para manter-se em contato e para enviar atualizações e ações de marketing. Por favor, confirme que você quer receber o nosso contato: Si, eu concordo em ser contatado por EMAIL .Você pode mudar de ideia a qualquer momento clicando no link the 'unsubscribe' no pé da página dos emails que você receber, ou contatando-nos em leonardo@wccm.org. Nós trataremos seus dados com respeito. Para mais informações sobre nossa política de privacidade, por favor visite nosso website. Ao clicar no link abaixo vocêconcorda que podemos processar seus dados de acordo com estes termos.",
          "I am not a robot": "Eu não sou um robô",
          "Join group": "Participar do grupo",
          "Your request to join was sent to the group leader": "Seu pedido foi enviado ao líder do grupo",
          "Group Creation Complete": "Criação do Crupo Completa",
          "Your group is now set up. The group is listed in the WCCM directory at WCCM.org as following our guidelines. The Group Leader will soon receive a sign-in link which allows access to the system under your supervision.": "Seu grupo está criado. Ele será listado no diretório da WCCM no site WCCM.org como um grupo que segue nossas diretrizes. O Líder do Grupo receberá um link de inscrição que permitirá acesso ao sistema sob sua supervisão.",
          "New group submitted succesfully": "Novo grupo submetido com sucesso",
          "Your group will be reviewed by our staff for approvation and public listing. You will be notified by email about the approval progress.": "Seu grupo será revisado por nossa equipe para aprovação e listagem pública. Você será notificado por email sobre a confirmação do pedido.",
          "Not a valid URL!": "Não é um Endereço válido!",
          "The 'URL to Detail Page' field has to be a valid URL (like 'http://google.com')": "O campo 'Endereço de Detlhes da Página' precisa ser válido (como 'http://google.com')",
          "Are you sure you want to delete this group?": "Você tem certeza de que quer apagar este grupo?",
          "No": "Não",
          "Yes": "Sim",
          "at": "em",
          "Dear": "Querida(o)",
          "WCCM Online Meditation Groups - Group Leader Role Assignment": "WCCM Online Meditação Grupos - Designação do Cargo de Líder de Grupo",
          "You are now the Group Leader of an Online Meditation Group": "Você agora é um Líder de um Grupo de Meditação Online",
          "The WCCM Online Mediation Groups Staff": "Equipe de Grupos de Meditação online da WCCM",
          "A separate notification will be sent to you. Please follow the link in that notification to set up your password that will allow you access to  the Online Meditation Group platform.  Once in the platform you will be able to manage your group communications": 'Uma notificação individual será enviada a você. Por favor clique no link da notificação para configurar sua senha, que lhe dará acesso à plataforma de Grupos de Meditação Online. Uma vez connectado você poderá gerenciar suas comunicações',
          "If you need further assistance please get in touch with Leo at": "Se você precisa de ajuda por favor contate Leo em",
          "Your group is now set up": "Seu grupo está criado",
          "The group is listed in the WCCM directory at WCCM.org as following our guidelines. The Group Leader will soon receive a sign-in link which allows access to the system under your supervision": "Ele será listado no diretório da WCCM no site WCCM.org como um grupo que segue nossas diretrizes. O Líder do Grupo receberá um link de inscrição que permitirá acesso ao sistema sob sua supervisão"



        }
      }
    },
    fallbackLng: 'en',
    debug: true,

    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ','
    },

    react: {
      wait: true
    }
  });

export default i18n;
