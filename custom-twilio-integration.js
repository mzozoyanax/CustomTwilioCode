// The free asp.net core app that I've hosted on somee.com...
const baseUrl = "http://www.qweerty.somee.com"; // <-- this is the official url to the rest api.

//This function call the RegisterLead method within the TwilioApi controller to insert a lead into sql server database...
async function registerLead(registerViewModel) {
    try {
        const response = await fetch(baseUrl + '/api/TwilioApi/RegisterLead', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerViewModel)
        });

        const data = await response.json();
        return data; // Assuming the API returns true/false
    } catch (error) {
        console.error('Error registering lead:', error);
        return false;
    }
}

// This function should forward incoming text messages from leads to Matt's phone number. It calls the ForwardTextMessage method within TwilioApi controller.
async function forwardTextMessage() {
    try {
        const response = await fetch(baseUrl + '/api/TwilioApi/ForwardTextMessage', {
            method: 'POST'
        });

        const data = await response.json();
        return data; // Assuming the API returns true/false
    } catch (error) {
        console.error('Error forwarding text message:', error);
        return false;
    }
}

// This is my own custom workflow that follows a sequence of sending follow-up text messages for leads who do not usually reply to the first intial text message...
async function activateWorkflow(workflowViewModel) {
     try {
        const response = await fetch(baseUrl + '/api/TwilioApi/ActivateWorkflow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(workflowViewModel)
        });

        const data = await response.json();
        return data; // Assuming the API returns true/false
    } catch (error) {
        console.error('Error registering lead:', error);
        return false;
    }
}

// This is the actual landing page data form that binded into a 'const' object called registerViewModel
const registerViewModel = {
    Name: document.getElementById('Name').value,
    Email: document.getElementById('Email').value,
    Phone: document.getElementById('Phone').value,
    Company: document.getElementById('Company').value
};

// This is the data form for the follow-up text-messaging seqeunce that calls the activateWorkflow http post request.
const workflowViewModel = {
    GroupId: '1',
    Name: document.getElementById('Name').value,
    RecipientPhoneNumber: document.getElementById('Phone').value,
    Reply: false,
	InitialMessage: '',
	FollowupMessage: '',
	Delay '86400000', // This sequence has 24 hour delay before it sends it next text-message. (requirement: must be written in Milliseconds) Use https://www.calculateme.com/time/hours/to-milliseconds/24
	Running: true
};

// This function should to handle the submit button click of actual landing page form.
document.getElementById('nf-submit-button').addEventListener('click', async () => {
    try {
        const [leadResult, workflowResult] = await Promise.all([
            registerLead(registerViewModel),
            activateWorkflow(workflowViewModel) 
        ]);

        console.log('Lead registered:', leadResult);
        console.log('Workflow activated:', workflowResult);

        // Forward text message after lead registration
        const forwardResult = await forwardTextMessage();
        console.log('Text message forwarded:', forwardResult);
    } catch (error) {
        console.error('Error:', error);
    }
});
