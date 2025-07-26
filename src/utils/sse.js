// This is the Utility function for SSE that can be used to create different connections to the server.

// options - should be passed by the caller to do different things based on the event.
export const createSSEConnection = (url, options) => {
  const eventSource = new EventSource(url, {
    withCredentials: true,
  });

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(data);
    options.onmessage?.(data);
  };

  eventSource.onerror = (error) => {
    console.error("SSE connection error:", error);
    options.onerror?.(error);
  };

  eventSource.onopen = () => {
    console.log("SSE Connected");
    options.onopen?.();
  };

  return {
    close: () => {
      console.log("Closing SSE connection");
      eventSource.close();
    },
    eventSource,
  };
};

// Main function to be called in the component.
export const onOrderUpdate = (userId, cb) => {
  const url = `${import.meta.env.VITE_BACKEND_URL}/sse/order/update/${userId}`;

  // Return the event source to the caller function - component
  return createSSEConnection(url, {
    onmessage: (data) => {
      console.log("SSE data received:", data);
      cb(data);
    },
    onerror: (error) => {
      console.error("SSE connection error:", error);
    },
    onopen: () => {
      console.log("SSE Connected");
    },
  });
};
