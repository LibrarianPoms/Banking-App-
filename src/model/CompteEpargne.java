package model;

public class CompteEpargne extends Compte {
    private double tauxInteret;
    
    public CompteEpargne(String numCompte, double soldeInitial, double tauxInteret) {
        super(numCompte, soldeInitial);
        this.tauxInteret = tauxInteret;
    }
    
    public double getTauxInteret() {
        return tauxInteret;
    }
    
    public void setTauxInteret(double tauxInteret) {
        this.tauxInteret = tauxInteret;
    }
    
    
    public double calculerInterets() {
        return this.solde * this.tauxInteret;
    }
    
    public void appliquerInterets() {
        double interets = calculerInterets();
        this.solde += interets;
    }
}
