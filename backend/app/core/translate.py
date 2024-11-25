# Libraries
from bs4 import BeautifulSoup
from unsloth.chat_templates import get_chat_template
from unsloth import FastLanguageModel
import torch

# Models
from app.models.translate_request import TargetLanguage

# Instances
max_seq_length = 2048 # Choose any! We auto support RoPE Scaling internally!
dtype = torch.float16 # None for auto detection. Float16 for Tesla T4, V100, Bfloat16 for Ampere+
load_in_4bit = True # Use 4bit quantization to reduce memory usage. Can be False.

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "AleNunezArroyo/Llama-3.2-3B-es_qu-S400", # or choose "unsloth/Llama-3.2-1B-Instruct"
    max_seq_length = max_seq_length,
    dtype = dtype,
    load_in_4bit = load_in_4bit,
)
tokenizer = get_chat_template(
    tokenizer,
    chat_template = "llama-3.1",
)

def translate_text(text: str, target_language: TargetLanguage) -> str:
    if target_language == "que":
        messages = [
            {"role": "user", "content": f"<|lang:es|>“{text}”<|lang:es|>"},
        ]
        FastLanguageModel.for_inference(model) # Enable native 2x faster inference
        inputs = tokenizer.apply_chat_template(
            messages,
            tokenize = True,
            add_generation_prompt = True, # Must add for generation
            return_tensors = "pt",
        ).to("cuda")

        outputs = model.generate(
            input_ids=inputs,
            max_new_tokens=128,  # Aumentar si la respuesta es muy corta
            use_cache=True,
            temperature=0.7,  # Menos aleatorio, más preciso
            min_p=0.7,  # Mayor probabilidad mínima para generar respuestas más consistentes
            top_p=0.9,  # Reduce la probabilidad de palabras menos probables
            top_k=50  # Considera solo los 50 tokens más probables
        )

        response = tokenizer.batch_decode(outputs)

        print(response[0])

        translation = response[0].split(
            ":qu|>")[1].split(
            "<|")[0].strip().replace("“", "").replace("”", "")

        # Check if match
        if len(translation) == 0:
            raise ValueError("Traducción no encontrada")
        return translation

    elif target_language == "esp": # In development...
        return text
        # return f"Traducción simulada al quechua: {text}"
    else:
        raise ValueError("Unsupported language")

def translate_html(html_content: str, target_language: TargetLanguage) -> str:
    # Parse the HTML content
    soup = BeautifulSoup(html_content, "html.parser")
    
    # Translate only the text content within the body tag, keeping the structure
    body = soup.body
    if body:
        for element in body.find_all(text=True):
            if element.parent.name in ["script", "style"]:
                continue
            if not element.strip():
                continue
            translated_text = translate_text(element.strip(), target_language)
            element.replace_with(translated_text)
    
    # Return the modified HTML as a string
    return str(soup)
