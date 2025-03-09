export type EmailJSPayload = {
    service_id: string;
    template_id: string;
    user_id: string;
    template_params: {
      [key: string]: any; // Allows for additional optional fields if needed
    };
  };