package server;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import model.*;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

public class SimpleHttpServer {
    private HttpServer server;
    //Stock data
    private static List<Client> clients = new ArrayList<>();
    private static List<Compte> comptes = new ArrayList<>();
    private static List<Transaction> transactions = new ArrayList<>();
    private static List<EmployeeDeBanque> employees = new ArrayList<>();
    private static List<Admin> admins = new ArrayList<>();

    public static void main(String[] args) throws Exception {
        SimpleHttpServer httpServer = new SimpleHttpServer();
        httpServer.start();
        httpServer.createSampleData();
    }

    public void start() throws Exception {
        //web
        server = HttpServer.create(new InetSocketAddress(8080), 0);
        
        
        server.createContext("/", new WebHandler());
        server.createContext("/api/clients", new ClientHandler());
        server.createContext("/api/accounts", new AccountHandler());
        server.createContext("/api/transactions", new TransactionHandler());
        server.createContext("/api/employees", new EmployeeHandler());
        server.createContext("/api/admins", new AdminHandler());
        
        //server start
        server.setExecutor(null);
        server.start();
        System.out.println("Server started on port 8080");
        System.out.println("Open http://localhost:8080 in your browser");
    }

    private void createSampleData() {
        
        Admin admin = new Admin("A001", "Admin");
        admins.add(admin);
        
        System.out.println("Sample data created - Admin only. Please create employees and clients through the admin interface.");
    }

    static class WebHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            
            if ("/".equals(path)) {
                path = "/index.html";
            }
            
           
            File file = new File("web" + path);
            
            if (!file.exists()) {
               
                String response = "404 File Not Found";
                exchange.sendResponseHeaders(404, response.length());
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
                return;
            }
            
           
            String contentType = "text/plain";
            if (path.endsWith(".html")) {
                contentType = "text/html";
            } else if (path.endsWith(".css")) {
                contentType = "text/css";
            } else if (path.endsWith(".js")) {
                contentType = "application/javascript";
            }
            
            
            exchange.getResponseHeaders().set("Content-Type", contentType);
            
          
            byte[] bytes = Files.readAllBytes(file.toPath());
            exchange.sendResponseHeaders(200, bytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(bytes);
            }
        }
    }

    // Handler for client API
    static class ClientHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String method = exchange.getRequestMethod();
            
            if ("GET".equals(method)) {
                // JSON response
                StringBuilder json = new StringBuilder("[");
                for (int i = 0; i < clients.size(); i++) {
                    Client client = clients.get(i);
                    json.append("{");
                    json.append("\"id\":\"").append(client.getIdClient()).append("\",");
                    json.append("\"nom\":\"").append(client.getNom()).append("\",");
                    json.append("\"numero\":\"").append(client.getNumero()).append("\",");
                    json.append("\"email\":\"").append(client.getAdresseEmail()).append("\"");
                    json.append("}");
                    if (i < clients.size() - 1) {
                        json.append(",");
                    }
                }
                json.append("]");
                
                // Send response
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                byte[] bytes = json.toString().getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(200, bytes.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(bytes);
                }
            } else if ("POST".equals(method)) {
                // Read the request body
                InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8);
                BufferedReader br = new BufferedReader(isr);
                StringBuilder requestBody = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    requestBody.append(line);
                }
                
               
                String clientId = extractValue(requestBody.toString(), "id");
                String clientName = extractValue(requestBody.toString(), "nom");
                String clientNumber = extractValue(requestBody.toString(), "numero");
                String clientEmail = extractValue(requestBody.toString(), "email");
                
                System.out.println("Creating new client: " + clientId + " - " + clientName);
                
               
                Client newClient = new Client(clientName, clientNumber, clientEmail, clientId);
                clients.add(newClient);
                
              
                String response = "{\"success\":true,\"message\":\"Client created successfully\"}";
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(200, bytes.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(bytes);
                }
            } else {
               
                String response = "Method not supported";
                exchange.sendResponseHeaders(405, response.length());
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
            }
        }
    }

    // Helper method to extract values from JSON
    private static String extractValue(String json, String key) {
        String searchStr = "\"" + key + "\":\"";
        int keyIndex = json.indexOf(searchStr);
        if (keyIndex != -1) {
            int valueStart = keyIndex + searchStr.length();
            int valueEnd = json.indexOf("\"", valueStart);
            if (valueEnd != -1) {
                return json.substring(valueStart, valueEnd);
            }
        }
        
        // Try number format
        searchStr = "\"" + key + "\":";
        keyIndex = json.indexOf(searchStr);
        if (keyIndex != -1) {
            int valueStart = keyIndex + searchStr.length();
            int valueEnd = json.indexOf(",", valueStart);
            if (valueEnd == -1) {
                valueEnd = json.indexOf("}", valueStart);
            }
            if (valueEnd != -1) {
                return json.substring(valueStart, valueEnd).trim();
            }
        }
        
        return "";
    }
    
    // Handler for account API
    static class AccountHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String method = exchange.getRequestMethod();
            
            if ("GET".equals(method)) {
                // Build JSON response
                StringBuilder json = new StringBuilder("[");
                for (int i = 0; i < comptes.size(); i++) {
                    Compte compte = comptes.get(i);
                    json.append("{");
                    json.append("\"id\":\"").append(compte.getNumCompte()).append("\",");
                    json.append("\"solde\":").append(compte.getSolde()).append(",");
                    json.append("\"clientId\":\"").append(compte.getClient().getIdClient()).append("\",");
                    json.append("\"type\":\"").append(compte instanceof CompteCourant ? "COURANT" : "EPARGNE").append("\"");
                    
                    if (compte instanceof CompteEpargne) {
                        json.append(",\"tauxInteret\":").append(((CompteEpargne) compte).getTauxInteret());
                    }
                    
                    json.append("}");
                    if (i < comptes.size() - 1) {
                        json.append(",");
                    }
                }
                json.append("]");
                
                // Send response
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                byte[] bytes = json.toString().getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(200, bytes.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(bytes);
                }
            } else if ("POST".equals(method)) {
                // Handle account creation
                // Read request body
                StringBuilder requestBody = new StringBuilder();
                try (java.io.BufferedReader br = new java.io.BufferedReader(
                        new java.io.InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8))) {
                    String line;
                    while ((line = br.readLine()) != null) {
                        requestBody.append(line);
                    }
                }
                
                // Parse JSON request
                String body = requestBody.toString();
                String clientId = extractValue(body, "clientId");
                String accountType = extractValue(body, "type");
                double initialBalance = Double.parseDouble(extractValue(body, "solde"));
                
                System.out.println("Account creation request received:");
                System.out.println("- Request body: " + body);
                System.out.println("- Client ID: " + clientId);
                System.out.println("- Account type: " + accountType);
                System.out.println("- Initial balance: " + initialBalance);
                
                // List all available clients for debugging
                System.out.println("Available clients:");
                for (Client c : clients) {
                    System.out.println("- ID: " + c.getIdClient() + ", Name: " + c.getNom());
                }
                
                // Find client - strict matching by ID
                Client client = null;
                for (Client c : clients) {
                    // Match exact client ID
                    if (c.getIdClient().equals(clientId)) {
                        client = c;
                        System.out.println("Client found: " + c.getNom() + ", ID: " + c.getIdClient());
                        break;
                    }
                }
                
                // Log if client is null after search
                if (client == null) {
                    System.out.println("ERROR: No client found with ID: " + clientId);
                }
                
                // No fallback - require exact client match
                if (client == null) {
                    System.out.println("Client with ID " + clientId + " not found!");
                }
                
                if (client != null) {
                    // Generate account ID
                    String accountId;
                    if ("COURANT".equals(accountType)) {
                        accountId = "CC" + String.format("%03d", (int)(Math.random() * 1000));
                    } else {
                        accountId = "CE" + String.format("%03d", (int)(Math.random() * 1000));
                    }
                    
                    // Create account with explicit client ID
                    Compte newAccount;
                    if ("COURANT".equals(accountType)) {
                        newAccount = new CompteCourant(accountId, initialBalance);
                    } else {
                        newAccount = new CompteEpargne(accountId, initialBalance, 0.03);
                    }
                    
                    // Explicitly set client on the account
                    newAccount.setClient(client);
                    
                    // Add account to client
                    client.ouvrirCompte(newAccount);
                    
                    // Store account in global list
                    comptes.add(newAccount);
                    
                    // Log the linked account
                    System.out.println("Account " + accountId + " created and linked to client " + client.getNom() + " (ID: " + client.getIdClient() + ")");
                    
                    // Send success response
                    String response = "{\"success\":true,\"id\":\"" + accountId + "\"}";
                    exchange.getResponseHeaders().set("Content-Type", "application/json");
                    byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
                    exchange.sendResponseHeaders(200, bytes.length);
                    try (OutputStream os = exchange.getResponseBody()) {
                        os.write(bytes);
                    }
                } else {
                    // Client not found - return error
                    String errorResponse = "{\"success\":false,\"error\":\"Client not found\"}";
                    exchange.getResponseHeaders().set("Content-Type", "application/json");
                    byte[] errorBytes = errorResponse.getBytes(StandardCharsets.UTF_8);
                    exchange.sendResponseHeaders(404, errorBytes.length);
                    try (OutputStream os = exchange.getResponseBody()) {
                        os.write(errorBytes);
                    }
                }
            } else {
                // Method not supported
                String methodResponse = "Method not supported";
                exchange.sendResponseHeaders(405, methodResponse.length());
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(methodResponse.getBytes());
                }
            }
        }
    }

    // Handler for transaction API
    static class TransactionHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String method = exchange.getRequestMethod();
            
            if ("GET".equals(method)) {
                // Build JSON response
                StringBuilder json = new StringBuilder("[");
                for (int i = 0; i < transactions.size(); i++) {
                    Transaction transaction = transactions.get(i);
                    json.append("{");
                    json.append("\"id\":\"").append(transaction.getId()).append("\",");
                    json.append("\"montant\":").append(transaction.getMontant()).append(",");
                    json.append("\"type\":\"").append(transaction.getType()).append("\",");
                    json.append("\"compteId\":\"").append(transaction.getCompte().getNumCompte()).append("\"");
                    json.append("}");
                    if (i < transactions.size() - 1) {
                        json.append(",");
                    }
                }
                json.append("]");
                
                // Send response
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                byte[] bytes = json.toString().getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(200, bytes.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(bytes);
                }
            } else {
                // Method not supported
                String response = "Method not supported";
                exchange.sendResponseHeaders(405, response.length());
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
            }
        }
    }

    // Handler for employee API
    static class EmployeeHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String method = exchange.getRequestMethod();
            
            if ("GET".equals(method)) {
                // Build JSON response
                StringBuilder json = new StringBuilder("[");
                for (int i = 0; i < employees.size(); i++) {
                    EmployeeDeBanque employee = employees.get(i);
                    json.append("{");
                    json.append("\"id\":\"").append(employee.getId()).append("\",");
                    json.append("\"nom\":\"").append(employee.getNom()).append("\"");
                    json.append("}");
                    if (i < employees.size() - 1) {
                        json.append(",");
                    }
                }
                json.append("]");
                
                // Send response
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                byte[] bytes = json.toString().getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(200, bytes.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(bytes);
                }
            } else {
                // Method not supported
                String response = "Method not supported";
                exchange.sendResponseHeaders(405, response.length());
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
            }
        }
    }

    // Handler for admin API
    static class AdminHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String method = exchange.getRequestMethod();
            
            if ("GET".equals(method)) {
                // Build JSON response
                StringBuilder json = new StringBuilder("[");
                for (int i = 0; i < admins.size(); i++) {
                    Admin admin = admins.get(i);
                    json.append("{");
                    json.append("\"id\":\"").append(admin.getId()).append("\",");
                    json.append("\"nom\":\"").append(admin.getNom()).append("\"");
                    json.append("}");
                    if (i < admins.size() - 1) {
                        json.append(",");
                    }
                }
                json.append("]");
                
                // Send response
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                byte[] bytes = json.toString().getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(200, bytes.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(bytes);
                }
            } else {
                // Method not supported
                String response = "Method not supported";
                exchange.sendResponseHeaders(405, response.length());
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
            }
        }
    }
}
