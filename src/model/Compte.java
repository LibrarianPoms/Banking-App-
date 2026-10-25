package model;

public abstract class Compte {
    protected String numCompte;
    protected double solde;
    protected Client client;
    protected boolean blocked = false; // Account blocking status

    public Compte(String numCompte, double soldeInitial) {
        this.numCompte = numCompte;
        this.solde = soldeInitial;
    }

    public String getNumCompte() {
        return numCompte;
    }

    public void setNumCompte(String numCompte) {
        this.numCompte = numCompte;
    }

    public double getSolde() {
        return solde;
    }

    public void setSolde(double solde) {
        this.solde = solde;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }
    
    public boolean isBlocked() {
        return blocked;
    }
    
    public void setBlocked(boolean blocked) {
        this.blocked = blocked;
    }

  
    public void deposer(double montant) {
        if (blocked) {
            throw new IllegalStateException("Ce compte est bloqué. Aucune opération n'est autorisée.");
        }
        
        if (montant > 0) {
            solde += montant;
        }
    }

    public boolean retrait(double montant) {
        if (blocked) {
            throw new IllegalStateException("Ce compte est bloqué. Aucune opération n'est autorisée.");
        }
        
        if (montant > 0 && solde >= montant) {
            solde -= montant;
            return true;
        }
        return false;
    }

    public double consulterSolde() {
        return this.solde;
    }

    public boolean verifierSolde(double montant) {
        return this.solde >= montant;
    }
}
