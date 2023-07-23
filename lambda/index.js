/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, API calls, and more.
 * */
const Alexa = require('ask-sdk-core');

const token = 'b8d61aa9562c';
const hash = '95c224c0-343c-4e94-9e7f-9fa4ff036a67';

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speakOutput = 'Qual ação você deseja executar no alimentador?';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

const FeedPetIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'FeedPetIntent';
  },
  handle(handlerInput) {
    const pet = handlerInput.requestEnvelope.request.intent.slots.pet.value;
    const topic = `feeder/${token}`;
    const body = {
      topic: topic,
	    action: "feed",
      quantidade: 50,
      tempoBandeja: 1
    };
    
    const axios = require('axios');

    return axios.post('https://miaufeeder.herokuapp.com/receive-feed-info', body)
    .then(_ => {
      const petName = pet.replace(/^(o|a)\s/i, '').replace(/\bmeu\b/gi, 'seu').replace(/\bminha\b/gi, 'sua');
 
      const speakOutput = `A ração foi liberada. ${petName} está sendo alimentado!`;
 
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
        })
    .catch(err => {
      const speakOutput = `Houve um erro: ${err.message}`;

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
      })
    }
};

const IAIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'IAIntent';
  },
  handle(handlerInput) {
    const pet = handlerInput.requestEnvelope.request.intent.slots.pet.value;
    
    const axios = require('axios');

    return axios.get(`https://miaufeeder.herokuapp.com/optimized-schedule/all_pets`)
    .then( response => {
      const petName = pet.replace(/^(o|a)\s/i, '').replace(/\bmeu\b/gi, 'seu').replace(/\bminha\b/gi, 'sua');
      const quantidade = response.data.quantidade;
      const horario = response.data.horario;

      const horarioVec = horario.split(':');
 
      const speakOutput = `A melhor alimentação para ${petName} consiste numa alimentação com ${quantidade} gramas às ${horarioVec[0]} horas e ${horarioVec[1]} minutos.`;
 
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
        })
    .catch(err => {
      const speakOutput = `Houve um erro: ${err.message}`;

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
      })
    }
};

const BajulacaoHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'BajulacaoIntent';
  },
  handle(handlerInput) {
    const speakOutput = 'Éssi Éssi. Com certeza!';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  }
};

const ScheduleRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
          Alexa.getIntentName(handlerInput.requestEnvelope) === 'ScheduleIntent';
    },
    handle(handlerInput) {
      const speakOutput = 'Para qual horário você quer agendar a alimentação?';
  
      return handlerInput.responseBuilder
        .speak('Ok')
        .reprompt(speakOutput)
        .getResponse();
    }
  };

const LastFeedHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'LastFeedIntent';
  },
  handle(handlerInput) {

  const pet = handlerInput.requestEnvelope.request.intent.slots.pet.value;

  const axios = require('axios');

  return axios.get(`https://miaufeeder.herokuapp.com/histories/${hash}`)
    .then(response => {
      const histories = response.data.pop();

      const horarioVec = histories.horario.split(':');

      const horario = `${horarioVec[0]}:${horarioVec[1]}`;
      const petName = pet.replace(/^(o|a)\s/i, '');
 
      const speakOutput = `O ${petName} comeu ${histories.quantidadeConsumida} gramas às ${horario}`;
 
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
        })
    .catch(err => {
      const speakOutput = `Houve um erro: ${err.message}`;

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
      })
    }
};

const StatusIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'StatusIntent';
  },
  async handle(handlerInput) {
    const axios = require('axios');

    return axios.get(`https://miaufeeder.herokuapp.com/feeder/${token}`)
      .then( response => {
          let speakOutput = `O alimentador está conectado. O nível do reservatório está em ${response.data.reservatory_level}%.`;
      
          if (response.data.reservatory_level <= 20) {
            speakOutput += ' É recomendado recarregar o reservatório com mais ração!';
          }

        return handlerInput.responseBuilder
          .speak(speakOutput)
          .getResponse();
      })
      .catch(error => {
        return handlerInput.responseBuilder
        .speak('Ocorreu um erro!' + error)
        .getResponse();
      })
  }
};

const ListSchedulesHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'ListSchedulesIntent';
  },
  handle(handlerInput) {
    const speakOutput = 'Aqui está a lista de agendamentos';

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent' ||
        Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speakOutput = 'Goodbye!';

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  }
};

const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    return handlerInput.responseBuilder.getResponse();
  }
};

const IntentReflectorHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
  },
  handle(handlerInput) {
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    const speakOutput = `You just triggered ${intentName}`;

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
    console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    FeedPetIntentHandler,
    StatusIntentHandler,
    ListSchedulesHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    ScheduleRequestHandler,
    IAIntentHandler,
    BajulacaoHandler,
    LastFeedHandler,
    IntentReflectorHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withCustomUserAgent('sample/hello-world/v1.2')
  .lambda();
