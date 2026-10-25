import model.*;

public class BankingSystemMain {
    public static void main(String[] args) {
        System.out.println("Starting Banking System Application...");
        
       
        System.out.println("Creating sample data...");
        
       
        Client client = new Client("Dupont", "0123456789", "dupont@email.com", "C001");
        System.out.println("Created client: " + client.getNom());
        
       
        EmployeeDeBanque employee = new EmployeeDeBanque("E001", "Martin");
        System.out.println("Created employee: " + employee.getNom());
        
        
        Compte compteCourant = employee.creerCompte("CC001", 1500, client, "COURANT");
        System.out.println("Created current account with balance: " + compteCourant.getSolde());
        
        Compte compteEpargne = employee.creerCompte("CE001", 5000, client, "EPARGNE");
        System.out.println("Created savings account with balance: " + compteEpargne.getSolde());
        
        
        System.out.println("\nPerforming transactions...");
        
       
        Transaction depositTransaction = new Transaction("T001", 500, "DEPOT", compteCourant);
        client.effectuerTransaction(depositTransaction);
        System.out.println("Deposit transaction completed. New balance: " + compteCourant.getSolde());
        
      
        Transaction withdrawalTransaction = new Transaction("T002", 200, "RETRAIT", compteCourant);
        client.effectuerTransaction(withdrawalTransaction);
        System.out.println("Withdrawal transaction completed. New balance: " + compteCourant.getSolde());
        
        
        if (compteEpargne instanceof CompteEpargne) {
            CompteEpargne savings = (CompteEpargne) compteEpargne;
            double interestAmount = savings.calculerInterets();
            savings.appliquerInterets();
            System.out.println("Applied interest of " + interestAmount + " to savings account. New balance: " + savings.getSolde());
        }
        
        System.out.println("\nBanking System backend simulation completed.");
        System.out.println("To view the web interface, open the web/index.html file in your browser.");
    }
}
