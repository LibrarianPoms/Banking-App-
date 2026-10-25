package model;

public class Transaction {
    private String id;
    private double montant;
    private String type;
    private Compte compte;
    
    public Transaction(String id, double montant, String type, Compte compte) {
        this.id = id;
        this.montant = montant;
        this.type = type;
        this.compte = compte;
    }
    
  
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public double getMontant() {
        return montant;
    }
    
    public void setMontant(double montant) {
        this.montant = montant;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public Compte getCompte() {
        return compte;
    }
    
    public void setCompte(Compte compte) {
        this.compte = compte;
    }
    
    
    public void effectuer() {
        if (type.equals("DEPOT")) {
            compte.deposer(montant);
        } else if (type.equals("RETRAIT")) {
            compte.retrait(montant);
        }
    }
    
    public boolean verifier() {
        if (type.equals("RETRAIT")) {
            return compte.verifierSolde(montant);
        }
        return true;
    }
    
    public void annuler() {
        if (type.equals("DEPOT")) {
            compte.retrait(montant);
        } else if (type.equals("RETRAIT")) {
            compte.deposer(montant);
        }
    }
}
