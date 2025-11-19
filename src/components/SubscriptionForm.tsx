import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface SubscriptionData {
  name?: string;
  email: string;
  submittedAt: string;
  mock: boolean;
}

/**
 * Placeholder function for future HubSpot integration
 * 
 * To integrate with HubSpot:
 * 1. Install HubSpot API client: npm install @hubspot/api-client
 * 2. Set up environment variables for HubSpot API key
 * 3. Replace the mock logic below with actual HubSpot API calls
 * 
 * Example implementation:
 * ```
 * import { Client } from '@hubspot/api-client';
 * 
 * const hubspotClient = new Client({ apiKey: process.env.HUBSPOT_API_KEY });
 * 
 * async function submitToHubspot(data: SubscriptionData) {
 *   try {
 *     const response = await hubspotClient.crm.contacts.basicApi.create({
 *       properties: {
 *         email: data.email,
 *         firstname: data.name || '',
 *         // Add custom properties as needed
 *       }
 *     });
 *     return { success: true, data: response };
 *   } catch (error) {
 *     console.error('HubSpot submission error:', error);
 *     return { success: false, error };
 *   }
 * }
 * ```
 */
async function submitToHubspot(data: SubscriptionData): Promise<{ success: boolean; message?: string }> {
  // TODO: Replace this mock implementation with actual HubSpot API integration
  console.log("📧 Mock subscription data:", data);
  
  // Simulate API delay (800-1200ms)
  const delay = 800 + Math.random() * 400;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Simulate 8-10% failure rate
  const shouldFail = Math.random() < 0.09;
  
  if (shouldFail) {
    return { success: false, message: "Error al procesar la suscripción. Por favor intenta de nuevo." };
  }
  
  return { success: true, message: "¡Gracias por suscribirte! Pronto recibirás nuestras cápsulas." };
}

export const SubscriptionForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      setMessage({ type: "error", text: "Por favor ingresa un email válido." });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const submissionData: SubscriptionData = {
      name: name.trim() || undefined,
      email: email.trim(),
      submittedAt: new Date().toISOString(),
      mock: true,
    };

    const result = await submitToHubspot(submissionData);

    setIsSubmitting(false);

    if (result.success) {
      setMessage({ type: "success", text: result.message || "¡Suscripción exitosa!" });
      setName("");
      setEmail("");
    } else {
      setMessage({ type: "error", text: result.message || "Error al suscribirse." });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-destructive/5">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Suscríbete</CardTitle>
        <CardDescription>
          Recibe nuevas cápsulas y novedades automotor en tu correo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre (opcional)</Label>
            <Input
              id="name"
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="required">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              aria-required="true"
            />
          </div>
          
          {message && (
            <div
              role="alert"
              aria-live="polite"
              className={`p-3 rounded-md text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#1C3B71] to-[#D70102] text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Suscribirse"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
