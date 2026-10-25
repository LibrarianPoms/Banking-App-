package model;

public class EmployeeDeBanque {
    private String id;
    private String nom;
    
    public EmployeeDeBanque(String id, String nom) {
        this.id = id;
        this.nom = nom;
    }
    
   
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getNom() {
        return nom;
    }
    
    public void setNom(String nom) {
        this.nom = nom;
    }
    
   
    public void validerTransaction(Transaction transaction) {
        if (transaction.verifier()) {
            transaction.effectuer();
            System.out.println("Transaction validée: " + transaction.getId());
        } else {
            System.out.println("Transaction refusée: " + transaction.getId());
        }
    }
    
    public Compte creerCompte(String numCompte, double soldeInitial, Client client, String type) {
        Compte compte;
        if (type.equals("COURANT")) {
            compte = new CompteCourant(numCompte, soldeInitial);
        } else {
            compte = new CompteEpargne(numCompte, soldeInitial, 0.03); // Default interest rate
        }
        client.ouvrirCompte(compte);
        return compte;
    }
    
    public void bloquerCompte(Compte compte) {
  
        System.out.println("Compte bloqué: " + compte.getNumCompte());
    }
}
