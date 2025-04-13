{
  "name": "Ultimate AI Personal Assistant",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "minutes",
              "expression": "5"
            }
          ]
        }
      },
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1,
      "position": [
        250,
        300
      ],
      "webhookId": "55b6bcf5-21f7-4694-af80-ca870c2bbbd4"
    },
    {
      "parameters": {
        "path": "webhook",
        "options": {}
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [
        450,
        300
      ],
      "webhookId": "55b6bcf5-21f7-4694-af80-ca870c2bbbd4"
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.message}}",
              "operation": "contains",
              "value2": "todo"
            }
          ]
        }
      },
      "name": "Is Todo Request?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        650,
        300
      ]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.message}}",
              "operation": "contains",
              "value2": "calendar"
            }
          ]
        }
      },
      "name": "Is Calendar Request?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        850,
        300
      ]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.message}}",
              "operation": "contains",
              "value2": "email"
            }
          ]
        }
      },
      "name": "Is Email Request?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        1050,
        300
      ]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.message}}",
              "operation": "contains",
              "value2": "research"
            }
          ]
        }
      },
      "name": "Is Research Request?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        1250,
        300
      ]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.message}}",
              "operation": "contains",
              "value2": "remind"
            }
          ]
        }
      },
      "name": "Is Reminder Request?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        1450,
        300
      ]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.message}}",
              "operation": "contains",
              "value2": "note"
            }
          ]
        }
      },
      "name": "Is Note Request?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        1650,
        300
      ]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.message}}",
              "operation": "contains",
              "value2": "weather"
            }
          ]
        }
      },
      "name": "Is Weather Request?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        1850,
        300
      ]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.message}}",
              "operation": "contains",
              "value2": "news"
            }
          ]
        }
      },
      "name": "Is News Request?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        2050,
        300
      ]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.message}}",
              "operation": "contains",
              "value2": "translate"
            }
          ]
        }
      },
      "name": "Is Translation Request?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        2250,
        300
      ]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.message}}",
              "operation": "contains",
              "value2": "summarize"
            }
          ]
        }
      },
      "name": "Is Summarization Request?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        2450,
        300
      ]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.message}}",
              "operation": "contains",
              "value2": "search"
            }
          ]
        }
      },
      "name": "Is Search Request?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        2650,
        300
      ]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.message}}",
              "operation": "contains",
              "value2": "help"
            }
          ]
        }
      },
      "name": "Is Help Request?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        2850,
        300
      ]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "prompt": "={{$json.message}}",
        "options": {
          "temperature": 0.7,
          "maxTokens": 1000
        }
      },
      "name": "AI Agent - General Response",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        3050,
        300
      ]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "prompt": "You are a helpful AI assistant. The user has asked about todos. Please analyze their request and extract the following information:\n\n1. Action (add, list, complete, delete)\n2. Task description (if adding)\n3. Task ID (if completing or deleting)\n\nUser request: {{$json.message}}\n\nRespond in JSON format with these fields.",
        "options": {
          "temperature": 0.3,
          "maxTokens": 500
        }
      },
      "name": "AI Agent - Todo Analysis",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        650,
        500
      ]
    },
    {
      "parameters": {
        "operation": "create",
        "table": "todos",
        "data": "={{$json.choices[0].message.content}}"
      },
      "name": "Supabase - Create Todo",
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [
        850,
        500
      ]
    },
    {
      "parameters": {
        "operation": "read",
        "table": "todos",
        "options": {
          "orderBy": "created_at",
          "order": "desc"
        }
      },
      "name": "Supabase - Get Todos",
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [
        850,
        600
      ]
    },
    {
      "parameters": {
        "operation": "update",
        "table": "todos",
        "id": "={{$json.choices[0].message.content.id}}",
        "data": {
          "completed": true
        }
      },
      "name": "Supabase - Complete Todo",
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [
        850,
        700
      ]
    },
    {
      "parameters": {
        "operation": "delete",
        "table": "todos",
        "id": "={{$json.choices[0].message.content.id}}"
      },
      "name": "Supabase - Delete Todo",
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [
        850,
        800
      ]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "prompt": "Format the following todo list into a readable response for the user:\n\n{{$json.data}}",
        "options": {
          "temperature": 0.3,
          "maxTokens": 500
        }
      },
      "name": "AI Agent - Format Todo List",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        1050,
        600
      ]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "prompt": "You are a helpful AI assistant. The user has asked about their calendar. Please analyze their request and extract the following information:\n\n1. Action (add, list, delete)\n2. Event details (title, date, time, location, description)\n3. Event ID (if deleting)\n\nUser request: {{$json.message}}\n\nRespond in JSON format with these fields.",
        "options": {
          "temperature": 0.3,
          "maxTokens": 500
        }
      },
      "name": "AI Agent - Calendar Analysis",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        850,
        500
      ]
    },
    {
      "parameters": {
        "resource": "event",
        "operation": "create",
        "summary": "={{$json.choices[0].message.content.title}}",
        "start": {
          "dateTime": "={{$json.choices[0].message.content.date}}",
          "timeZone": "America/New_York"
        },
        "end": {
          "dateTime": "={{$json.choices[0].message.content.endDate}}",
          "timeZone": "America/New_York"
        },
        "location": "={{$json.choices[0].message.content.location}}",
        "description": "={{$json.choices[0].message.content.description}}"
      },
      "name": "Google Calendar - Create Event",
      "type": "n8n-nodes-base.googleCalendar",
      "typeVersion": 1,
      "position": [
        1050,
        500
      ]
    },
    {
      "parameters": {
        "resource": "event",
        "operation": "getAll",
        "calendar": {
          "__rl": true,
          "value": "primary",
          "mode": "list",
          "cachedResultName": "Primary Calendar"
        },
        "timeMin": "={{$now.subtract(7, 'days').toISOString()}}",
        "timeMax": "={{$now.add(30, 'days').toISOString()}}",
        "options": {
          "orderBy": "startTime",
          "singleEvents": true
        }
      },
      "name": "Google Calendar - Get Events",
      "type": "n8n-nodes-base.googleCalendar",
      "typeVersion": 1,
      "position": [
        1050,
        600
      ]
    },
    {
      "parameters": {
        "resource": "event",
        "operation": "delete",
        "calendar": {
          "__rl": true,
          "value": "primary",
          "mode": "list",
          "cachedResultName": "Primary Calendar"
        },
        "eventId": "={{$json.choices[0].message.content.id}}"
      },
      "name": "Google Calendar - Delete Event",
      "type": "n8n-nodes-base.googleCalendar",
      "typeVersion": 1,
      "position": [
        1050,
        700
      ]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "prompt": "Format the following calendar events into a readable response for the user:\n\n{{$json.items}}",
        "options": {
          "temperature": 0.3,
          "maxTokens": 500
        }
      },
      "name": "AI Agent - Format Calendar",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        1250,
        600
      ]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "prompt": "You are a helpful AI assistant. The user has asked about their email. Please analyze their request and extract the following information:\n\n1. Action (send, read, search)\n2. Recipient (if sending)\n3. Subject (if sending)\n4. Body (if sending)\n5. Search query (if searching)\n\nUser request: {{$json.message}}\n\nRespond in JSON format with these fields.",
        "options": {
          "temperature": 0.3,
          "maxTokens": 500
        }
      },
      "name": "AI Agent - Email Analysis",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        1050,
        500
      ]
    },
    {
      "parameters": {
        "resource": "message",
        "operation": "send",
        "fromEmail": "={{$env.GMAIL_ADDRESS}}",
        "toEmail": "={{$json.choices[0].message.content.recipient}}",
        "subject": "={{$json.choices[0].message.content.subject}}",
        "text": "={{$json.choices[0].message.content.body}}"
      },
      "name": "Gmail - Send Email",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 1,
      "position": [
        1250,
        500
      ]
    },
    {
      "parameters": {
        "resource": "message",
        "operation": "getAll",
        "options": {
          "maxResults": 10,
          "q": "={{$json.choices[0].message.content.searchQuery}}"
        }
      },
      "name": "Gmail - Search Emails",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 1,
      "position": [
        1250,
        600
      ]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "prompt": "Format the following email search results into a readable response for the user:\n\n{{$json.messages}}",
        "options": {
          "temperature": 0.3,
          "maxTokens": 500
        }
      },
      "name": "AI Agent - Format Emails",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        1450,
        600
      ]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "prompt": "You are a helpful AI assistant. The user has asked for research on a topic. Please analyze their request and extract the following information:\n\n1. Research topic\n2. Specific questions or aspects to focus on\n3. Format preference (summary, detailed, bullet points)\n\nUser request: {{$json.message}}\n\nRespond in JSON format with these fields.",
        "options": {
          "temperature": 0.3,
          "maxTokens": 500
        }
      },
      "name": "AI Agent - Research Analysis",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        1250,
        500
      ]
    },
    {
      "parameters": {
        "url": "https://www.googleapis.com/customsearch/v1",
        "method": "GET",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "X-API-Key",
              "value": "={{$env.GOOGLE_SEARCH_API_KEY}}"
            }
          ]
        },
        "queryParameters": {
          "parameters": [
            {
              "name": "key",
              "value": "={{$env.GOOGLE_SEARCH_API_KEY}}"
            },
            {
              "name": "cx",
              "value": "={{$env.GOOGLE_SEARCH_ENGINE_ID}}"
            },
            {
              "name": "q",
              "value": "={{$json.choices[0].message.content.researchTopic}}"
            },
            {
              "name": "num",
              "value": "5"
            }
          ]
        }
      },
      "name": "HTTP Request - Google Search",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [
        1450,
        500
      ]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "prompt": "You are a research assistant. Based on the following search results, provide a comprehensive answer to the research topic: {{$json.choices[0].message.content.researchTopic}}\n\nFocus on these aspects: {{$json.choices[0].message.content.aspects}}\n\nFormat the response as: {{$json.choices[0].message.content.format}}\n\nSearch results:\n{{$json.items}}",
        "options": {
          "temperature": 0.5,
          "maxTokens": 1500
        }
      },
      "name": "AI Agent - Research Summary",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        1650,
        500
      ]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "prompt": "You are a helpful AI assistant. The user has asked to set a reminder. Please analyze their request and extract the following information:\n\n1. Reminder text\n2. Date and time\n3. Priority (high, medium, low)\n\nUser request: {{$json.message}}\n\nRespond in JSON format with these fields.",
        "options": {
          "temperature": 0.3,
          "maxTokens": 500
        }
      },
      "name": "AI Agent - Reminder Analysis",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        1450,
        500
      ]
    },
    {
      "parameters": {
        "operation": "create",
        "table": "reminders",
        "data": "={{$json.choices[0].message.content}}"
      },
      "name": "Supabase - Create Reminder",
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [
        1650,
        500
      ]
    },
    {
      "parameters": {
        "operation": "read",
        "table": "reminders",
        "options": {
          "orderBy": "datetime",
          "order": "asc"
        }
      },
      "name": "Supabase - Get Reminders",
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [
        1650,
        600
      ]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "prompt": "Format the following reminders into a readable response for the user:\n\n{{$json.data}}",
        "options": {
          "temperature": 0.3,
          "maxTokens": 500
        }
      },
      "name": "AI Agent - Format Reminders",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        1850,
        600
      ]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "prompt": "You are a helpful AI assistant. The user has asked to take a note. Please analyze their request and extract the following information:\n\n1. Note title\n2. Note content\n3. Category (work, personal, ideas, etc.)\n\nUser request: {{$json.message}}\n\nRespond in JSON format with these fields.",
        "options": {
          "temperature": 0.3,
          "maxTokens": 500
        }
      },
      "name": "AI Agent - Note Analysis",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        1650,
        500
      ]
    },
    {
      "parameters": {
        "operation": "create",
        "table": "notes",
        "data": "={{$json.choices[0].message.content}}"
      },
      "name": "Supabase - Create Note",
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [
        1850,
        500
      ]
    },
    {
      "parameters": {
        "operation": "read",
        "table": "notes",
        "options": {
          "orderBy": "created_at",
          "order": "desc"
        }
      },
      "name": "Supabase - Get Notes",
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [
        1850,
        600
      ]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "prompt": "Format the following notes into a readable response for the user:\n\n{{$json.data}}",
        "options": {
          "temperature": 0.3,
          "maxTokens": 500
        }
      },
      "name": "AI Agent - Format Notes",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        2050,
        600
      ]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "prompt": "You are a helpful AI assistant. The user has asked about the weather. Please analyze their request and extract the following information:\n\n1. Location (city, state/country)\n2. Time frame (current, today, tomorrow, this week)\n\nUser request: {{$json.message}}\n\nRespond in JSON format with these fields.",
        "options": {
          "temperature": 0.3,
          "maxTokens": 500
        }
      },
      "name": "AI Agent - Weather Analysis",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        1850,
        500
      ]
    },
    {
      "parameters": {
        "url": "https://api.openweathermap.org/data/2.5/weather",
        "method": "GET",
        "queryParameters": {
          "parameters": [
            {
              "name": "q",
              "value": "={{$json.choices[0].message.content.location}}"
            },
            {
              "name": "appid",
              "value": "={{$env.OPENWEATHER_API_KEY}}"
            },
            {
              "name": "units",
              "value": "metric"
            }
          ]
        }
      },
      "name": "HTTP Request - Current Weather",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [
        2050,
        500
      ]
    },
    {
      "parameters": {
        "url": "https://api.openweathermap.org/data/2.5/forecast",
        "method": "GET",
        "queryParameters": {
          "parameters": [
            {
              "name": "q",
              "value": "={{$json.choices[0].message.content.location}}"
            },
            {
              "name": "appid",
              "value": "={{$env.OPENWEATHER_API_KEY}}"
            },
            {
              "name": "units",
              "value": "metric"
            }
          ]
        }
      },
      "name": "HTTP Request - Weather Forecast",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [
        2050,
        600
      ]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "prompt": "Format the following weather data into a readable response for the user. Include temperature, conditions, and any relevant alerts:\n\nCurrent weather: {{$json}}\nForecast: {{$json}}\n\nTime frame requested: {{$json.choices[0].message.content.timeFrame}}",
        "options": {
          "temperature": 0.3,
          "maxTokens": 500
        }
      },
      "name": "AI Agent - Format Weather",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        2250,
        500
      ]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "prompt": "You are a helpful AI assistant. The user has asked for news. Please analyze their request and extract the following information:\n\n1. Topic or category of news\n2. Time frame (today, this week, this month)\n3. Number of articles to return\n\nUser request: {{$json.message}}\n\nRespond in JSON format with these fields.",
        "options": {
          "temperature": 0.3,
          "maxTokens": 500
        }
      },
      "name": "AI Agent - News Analysis",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        2050,
        500
      ]
    },
    {
      "parameters": {
        "url": "https://newsapi.org/v2/top-headlines",
        "method": "GET",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "X-Api-Key",
              "value": "={{$env.NEWS_API_KEY}}"
            }
          ]
        },
        "queryParameters": {
          "parameters": [
            {
              "name": "category",
              "value": "={{$json.choices[0].message.content.topic}}"
            },
            {
              "name": "pageSize",
              "value": "={{$json.choices[0].message.content.numberOfArticles}}"
            }
          ]
        }
      },
      "name": "HTTP Request - News API",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [
        2250,
        500
      ]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "prompt": "Format the following news articles into a readable response for the user. Include headlines, brief summaries, and sources:\n\n{{$json.articles}}",
        "options": {
          "temperature": 0.3,
          "maxTokens": 500
        }
      },
      "name": "AI Agent - Format News",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        2450,
        500
      ]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "prompt": "You are a helpful AI assistant. The user has asked to translate text. Please analyze their request and extract the following information:\n\n1. Text to translate\n2. Target language\n3. Source language (if specified)\n\nUser request: {{$json.message}}\n\nRespond in JSON format with these fields.",
        "options": {
          "temperature": 0.3,
          "maxTokens": 500
        }
      },
      "name": "AI Agent - Translation Analysis",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        2250,
        500
      ]
    },
    {
      "parameters": {
        "url": "https://translation.googleapis.com/language/translate/v2",
        "method": "POST",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Bearer {{$env.GOOGLE_TRANSLATE_API_KEY}}"
            }
          ]
        },
        "body": {
          "q": "={{$json.choices[0].message.content.text}}",
          "target": "={{$json.choices[0].message.content.targetLanguage}}",
          "source": "={{$json.choices[0].message.content.sourceLanguage}}"
        }
      },
      "name": "HTTP Request - Google Translate",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [
        2450,
        500
      ]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "prompt": "Format the following translation into a readable response for the user:\n\nOriginal text: {{$json.choices[0].message.content.text}}\nTranslated text: {{$json.data.translations[0].translatedText}}\nTarget language: {{$json.choices[0].message.content.targetLanguage}}",
        "options": {
          "temperature": 0.3,
          "maxTokens": 500
        }
      },
      "name": "AI Agent - Format Translation",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        2650,
        500
      ]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "prompt": "You are a helpful AI assistant. The user has asked to summarize text. Please analyze their request and extract the following information:\n\n1. Text to summarize\n2. Length preference (short, medium, detailed)\n3. Focus areas (if specified)\n\nUser request: {{$json.message}}\n\nRespond in JSON format with these fields.",
        "options": {
          "temperature": 0.3,
          "maxTokens": 500
        }
      },
      "name": "AI Agent - Summarization Analysis",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        2450,
        500
      ]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "prompt": "Summarize the following text according to these specifications:\n\nText: {{$json.choices[0].message.content.text}}\nLength: {{$json.choices[0].message.content.length}}\nFocus: {{$json.choices[0].message.content.focus}}",
        "options": {
          "temperature": 0.5,
          "maxTokens": 1000
        }
      },
      "name": "AI Agent - Summarize Text",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        2650,
        500
      ]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "prompt": "You are a helpful AI assistant. The user has asked to search for information. Please analyze their request and extract the following information:\n\n1. Search query\n2. Type of information (web, images, videos, etc.)\n3. Number of results\n\nUser request: {{$json.message}}\n\nRespond in JSON format with these fields.",
        "options": {
          "temperature": 0.3,
          "maxTokens": 500
        }
      },
      "name": "AI Agent - Search Analysis",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        2650,
        500
      ]
    },
    {
      "parameters": {
        "url": "https://www.googleapis.com/customsearch/v1",
        "method": "GET",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "X-API-Key",
              "value": "={{$env.GOOGLE_SEARCH_API_KEY}}"
            }
          ]
        },
        "queryParameters": {
          "parameters": [
            {
              "name": "key",
              "value": "={{$env.GOOGLE_SEARCH_API_KEY}}"
            },
            {
              "name": "cx",
              "value": "={{$env.GOOGLE_SEARCH_ENGINE_ID}}"
            },
            {
              "name": "q",
              "value": "={{$json.choices[0].message.content.searchQuery}}"
            },
            {
              "name": "num",
              "value": "={{$json.choices[0].message.content.numberOfResults}}"
            },
            {
              "name": "searchType",
              "value": "={{$json.choices[0].message.content.type}}"
            }
          ]
        }
      },
      "name": "HTTP Request - Google Search",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [
        2850,
        500
      ]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "prompt": "Format the following search results into a readable response for the user:\n\n{{$json.items}}",
        "options": {
          "temperature": 0.3,
          "maxTokens": 500
        }
      },
      "name": "AI Agent - Format Search Results",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        3050,
        500
      ]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "prompt": "You are a helpful AI assistant. The user has asked for help. Please provide a comprehensive list of capabilities and commands that this AI assistant can perform. Include examples for each capability.",
        "options": {
          "temperature": 0.5,
          "maxTokens": 1000
        }
      },
      "name": "AI Agent - Help Response",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        2850,
        500
      ]
    },
    {
      "parameters": {
        "function": "Code",
        "code": "// Combine all responses into a single output\nconst responses = [];\n\n// Add the appropriate response based on the workflow path\nif ($input.item.json.choices && $input.item.json.choices[0] && $input.item.json.choices[0].message) {\n  responses.push($input.item.json.choices[0].message.content);\n}\n\n// Return the combined response\nreturn { json: { output: responses.join('\\n\\n') } };"
      },
      "name": "Code - Combine Responses",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [
        3250,
        300
      ]
    },
    {
      "parameters": {
        "url": "https://api.elevenlabs.io/v1/text-to-speech/5Q0t7uMcjvnagumLfvZi",
        "method": "POST",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "xi-api-key",
              "value": "={{$env.ELEVENLABS_API_KEY}}"
            },
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "body": {
          "text": "={{$json.output}}",
          "model_id": "eleven_monolingual_v1",
          "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75
          }
        }
      },
      "name": "HTTP Request - ElevenLabs TTS",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [
        3450,
        300
      ]
    },
    {
      "parameters": {
        "function": "Code",
        "code": "// Return the final response\nreturn { json: { output: $input.item.json.output } };"
      },
      "name": "Code - Final Response",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [
        3650,
        300
      ]
    }
  ],
  "connections": {
    "Schedule Trigger": {
      "main": [
        [
          {
            "node": "Webhook",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Webhook": {
      "main": [
        [
          {
            "node": "Is Todo Request?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Is Todo Request?": {
      "main": [
        [
          {
            "node": "Is Calendar Request?",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "AI Agent - Todo Analysis",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Is Calendar Request?": {
      "main": [
        [
          {
            "node": "Is Email Request?",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "AI Agent - Calendar Analysis",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Is Email Request?": {
      "main": [
        [
          {
            "node": "Is Research Request?",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "AI Agent - Email Analysis",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Is Research Request?": {
      "main": [
        [
          {
            "node": "Is Reminder Request?",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "AI Agent - Research Analysis",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Is Reminder Request?": {
      "main": [
        [
          {
            "node": "Is Note Request?",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "AI Agent - Reminder Analysis",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Is Note Request?": {
      "main": [
        [
          {
            "node": "Is Weather Request?",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "AI Agent - Note Analysis",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Is Weather Request?": {
      "main": [
        [
          {
            "node": "Is News Request?",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "AI Agent - Weather Analysis",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Is News Request?": {
      "main": [
        [
          {
            "node": "Is Translation Request?",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "AI Agent - News Analysis",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Is Translation Request?": {
      "main": [
        [
          {
            "node": "Is Summarization Request?",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "AI Agent - Translation Analysis",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Is Summarization Request?": {
      "main": [
        [
          {
            "node": "Is Search Request?",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "AI Agent - Summarization Analysis",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Is Search Request?": {
      "main": [
        [
          {
            "node": "Is Help Request?",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "AI Agent - Search Analysis",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Is Help Request?": {
      "main": [
        [
          {
            "node": "AI Agent - General Response",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "AI Agent - Help Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent - General Response": {
      "main": [
        [
          {
            "node": "Code - Combine Responses",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent - Todo Analysis": {
      "main": [
        [
          {
            "node": "Supabase - Create Todo",
            "type": "main",
            "index": 0
          },
          {
            "node": "Supabase - Get Todos",
            "type": "main",
            "index": 0
          },
          {
            "node": "Supabase - Complete Todo",
            "type": "main",
            "index": 0
          },
          {
            "node": "Supabase - Delete Todo",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Supabase - Create Todo": {
      "main": [
        [
          {
            "node": "AI Agent - Format Todo List",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Supabase - Get Todos": {
      "main": [
        [
          {
            "node": "AI Agent - Format Todo List",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Supabase - Complete Todo": {
      "main": [
        [
          {
            "node": "AI Agent - Format Todo List",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Supabase - Delete Todo": {
      "main": [
        [
          {
            "node": "AI Agent - Format Todo List",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent - Format Todo List": {
      "main": [
        [
          {
            "node": "Code - Combine Responses",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent - Calendar Analysis": {
      "main": [
        [
          {
            "node": "Google Calendar - Create Event",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Google Calendar - Create Event": {
      "main": [
        [
          {
            "node": "Google Calendar - Get Events",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Google Calendar - Get Events": {
      "main": [
        [
          {
            "node": "Google Calendar - Delete Event",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Google Calendar - Delete Event": {
      "main": [
        [
          {
            "node": "AI Agent - Format Calendar",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent - Format Calendar": {
      "main": [
        [
          {
            "node": "Code - Combine Responses",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent - Email Analysis": {
      "main": [
        [
          {
            "node": "Gmail - Send Email",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Gmail - Send Email": {
      "main": [
        [
          {
            "node": "Gmail - Search Emails",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Gmail - Search Emails": {
      "main": [
        [
          {
            "node": "AI Agent - Format Emails",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent - Format Emails": {
      "main": [
        [
          {
            "node": "Code - Combine Responses",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent - Research Analysis": {
      "main": [
        [
          {
            "node": "AI Agent - Research Summary",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent - Research Summary": {
      "main": [
        [
          {
            "node": "Code - Combine Responses",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent - Reminder Analysis": {
      "main": [
        [
          {
            "node": "Supabase - Create Reminder",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Supabase - Create Reminder": {
      "main": [
        [
          {
            "node": "AI Agent - Format Reminders",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent - Format Reminders": {
      "main": [
        [
          {
            "node": "Code - Combine Responses",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent - Note Analysis": {
      "main": [
        [
          {
            "node": "Supabase - Create Note",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Supabase - Create Note": {
      "main": [
        [
          {
            "node": "AI Agent - Format Notes",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent - Format Notes": {
      "main": [
        [
          {
            "node": "Code - Combine Responses",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent - Weather Analysis": {
      "main": [
        [
          {
            "node": "HTTP Request - Current Weather",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "HTTP Request - Current Weather": {
      "main": [
        [
          {
            "node": "HTTP Request - Weather Forecast",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "HTTP Request - Weather Forecast": {
      "main": [
        [
          {
            "node": "AI Agent - Format Weather",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent - Format Weather": {
      "main": [
        [
          {
            "node": "Code - Combine Responses",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent - News Analysis": {
      "main": [
        [
          {
            "node": "HTTP Request - News API",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "HTTP Request - News API": {
      "main": [
        [
          {
            "node": "AI Agent - Format News",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent - Format News": {
      "main": [
        [
          {
            "node": "Code - Combine Responses",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent - Translation Analysis": {
      "main": [
        [
          {
            "node": "HTTP Request - Google Translate",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "HTTP Request - Google Translate": {
      "main": [
        [
          {
            "node": "AI Agent - Format Translation",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent - Format Translation": {
      "main": [
        [
          {
            "node": "Code - Combine Responses",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent - Summarization Analysis": {
      "main": [
        [
          {
            "node": "AI Agent - Summarize Text",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent - Summarize Text": {
      "main": [
        [
          {
            "node": "Code - Combine Responses",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent - Search Analysis": {
      "main": [
        [
          {
            "node": "HTTP Request - Google Search",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "HTTP Request - Google Search": {
      "main": [
        [
          {
            "node": "AI Agent - Format Search Results",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent - Format Search Results": {
      "main": [
        [
          {
            "node": "Code - Combine Responses",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Agent - Help Response": {
      "main": [
        [
          {
            "node": "Code - Final Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Code - Final Response": {
      "main": [
        [
          {
            "node": "HTTP Request - ElevenLabs TTS",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "HTTP Request - ElevenLabs TTS": {
      "main": [
        [
          {
            "node": "Code - Final Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
} 