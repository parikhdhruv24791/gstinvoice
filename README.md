# gstinvoice

Install mongo, node   

```
npm install -g pm2

```

Go to folder and execute:   

```
npm install   / yarn    
pm2 start pm2.json

```

You can change the port in pm2.json - env     
DB Name: invoice     
Go to localhost:8080     


New: will create a new invoice - with auto filled invoice number     
Save will save to db     


TODO:        
- populate fields based on invoice number
- list all invoice
- search by invoice number
- save customer to separate collection and autofill option in invoice
- Reports