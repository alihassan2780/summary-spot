import logging
import PyPDF2
import pytesseract
from pdf2image import convert_from_path
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

# Set environment variable for Gemini API key
GEMINI_API_KEY = "AIzaSyAP_zPIvFvc3e4sULxqi0CcvhF-g-koeQU"

# Set up logging
logging.basicConfig(level=logging.INFO)

template = """Your document/text: {text}
Please summarize the above text in a clear and concise manner, using bullet points where applicable. 
Summarized text:"""

prompt = PromptTemplate(template=template, input_variables=["text"])

# Initialize the Gemini LLM
llm = ChatGoogleGenerativeAI(
    api_key=GEMINI_API_KEY,
    model="gemini-1.5-pro",
    model_kwargs={
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 8192,
        "response_mime_type": "text/plain"
    }
)

# Create a LangChain LLMChain
llmchain = LLMChain(prompt=prompt, llm=llm)

def generate_response(input_text):
    """Generates a summary response using LangChain and the Gemini model."""
    try:
        response = llmchain.run({"text": input_text})
        logging.info("Response generated successfully.")
        return response
    except Exception as e:
        logging.error(f"Error generating response: {e}")
        return "An error occurred while generating the response. Please try again."

def extract_text_from_pdf(file):
    """Extracts text from a PDF file, using OCR if necessary."""
    try:
        pdf_reader = PyPDF2.PdfReader(file)
        text = ""

        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            page_text = page.extract_text()

            if not page_text:
                logging.info(f"Page {page_num + 1}: No text found, using OCR.")
                images = convert_from_path(file, first_page=page_num + 1, last_page=page_num + 1)

                if images:
                    page_text = pytesseract.image_to_string(images[0])
                    logging.info(f"Page {page_num + 1}: OCR text extracted.")

            text += (page_text if page_text else "") + "\n"

        logging.info("Text extraction completed.")
        return text.strip()
    except Exception as e:
        logging.error(f"Error extracting text from PDF: {e}")
        return "An error occurred while extracting text from the PDF. Please try again."
