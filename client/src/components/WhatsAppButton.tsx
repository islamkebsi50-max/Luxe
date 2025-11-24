import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const phoneNumber = "1234567890"; // Replace with your actual WhatsApp number
  const message = "Hello, I have a question about a product";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover-elevate transition-all"
      data-testid="button-whatsapp"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
}
