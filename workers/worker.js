export default {
    async fetch(request) {
  
      const baseURL = 'https://bsky.app/profile/';
      const { hostname } = new URL(request.url);
      
      if (hostname.split('.').length >= 3) {
        return Response.redirect(baseURL + hostname);
      }
  
      return new Response(`
        <title>Eternal Return Community</title>
        <p>Discord @nicaksks</p>
        `, {
        headers: {
          "content-type": "text/html;charset=UTF-8",
        },
      })
  
    },
  };
