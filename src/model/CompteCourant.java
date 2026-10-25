package model;

public class CompteCourant extends Compte {
    
    public CompteCourant(String numCompte, double soldeInitial) {
        super(numCompte, soldeInitial);
    }
    
   
    public boolean decouvertAutorise(double montant) {
       
        return (this.solde - montant) >= -500;
    }
    
    public boolean utiliserDecouvert(double montant) {
        if (decouvertAutorise(montant)) {
            this.solde -= montant;
            return true;
        }
        return false;
    }
    
    public void appliquerFrais() {
        
        if (this.solde < 0) {
            this.solde -= 10;
        }
    }
}
