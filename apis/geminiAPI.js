const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const dotenv = require("dotenv");
dotenv.config()
const getDataFromGeminiAiForPdfAndImages =async (filePath, mimeType)=>{
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const fileManager = new GoogleAIFileManager(process.env.API_KEY);
  
    const uploadResponse = await fileManager.uploadFile(
      filePath,
      {
        mimeType: mimeType,
        displayName: "Gemini 1.5 PDF",
      }
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
  
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      { text: `Extract and return all the data from the submitted file without omitting any entries. 
        - For invoices, use the key "invoices" with an array of objects having the fields: serialNumber, date, productName, quantity, customerName, tax, totalAmount.
        - For products, use the key "products" with an array of objects having the fields: productName, quantity, unitPrice, tax, priceWithTax.
        - For customers, use the key "customers" with an array of objects having the fields: customerName, phoneNumber, totalPurchaseAmount.
          Give maximum of 10 records for each invoices, products, customers. Return only json data.If data is too large omit some data.
          Do not give any explainations.
          Use null if any fields are not available.
          Return unique records.
         `},
    ]);
    const data = result.response.text().slice(8).slice(0,-4);
    return data;
  }

  module.exports = {getDataFromGeminiAiForPdfAndImages}