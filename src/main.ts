import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import ollama from "ollama";

interface Params {}

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Ollama",
      description: "Integrate Firebot with a local Ollama Instance",
      author: "SolarLabyrinth",
      version: "1.0",
      firebotVersion: "5",
    };
  },
  getDefaultParameters: () => {
    return {};
  },
  run: (runRequest) => {
    runRequest.modules.effectManager.registerEffect({
      definition: {
        id: "solarlabyrinth:ollama:generate",
        name: "Ollama - Generate",
        description: "Generates a response from a prompt",
        icon: "",
        categories: ["advanced"],
        dependencies: [],
        outputs: [
          {
            label: "Ollama Response",
            defaultName: "ollamaResponse",
            description: "The response that Ollama generated for your prompt.",
          },
        ],
      },
      optionsTemplate: `
        <eos-container>
          <firebot-input 
            model="effect.model" 
            placeholder-text="Enter Model"
          />
        </eos-container>
        <eos-container pad-top="true">
          <firebot-input 
            model="effect.system" 
            use-text-area="true"
            placeholder-text="Enter System"
          />
        </eos-container>
        <eos-container pad-top="true">
          <firebot-input 
            model="effect.prompt" 
            use-text-area="true"
            placeholder-text="Enter Prompt"
          />
        </eos-container>
      `,
      async onTriggerEvent(event) {
        const { effect } = event;

        const res = await ollama.generate({
          model: effect.model,
          prompt: effect.prompt,
          system: effect.system,
        });

        return {
          success: true,
          outputs: {
            ollamaResponse: res.response,
          },
        };
      },
    } as Effects.EffectType<{ model: string; system: string; prompt: string }>);
  },
};

export default script;
