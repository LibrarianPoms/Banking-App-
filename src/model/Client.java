package model;

import java.util.ArrayList;
import java.util.List;

public class Client {
    private String nom;
    private String numero;
    private String adresseEmail;
    private String idClient;
    private List<Compte> comptes;

    public Client(String nom, String numero, String adresseEmail, String idClient) {
        this.nom = nom;
        this.numero = numero;
        this.adresseEmail = adresseEmail;
        this.idClient = idClient;
        this.comptes = new ArrayList<>();
    }

   
    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getAdresseEmail() {
        return adresseEmail;
    }

    public void setAdresseEmail(String adresseEmail) {
        this.adresseEmail = adresseEmail;
    }

    public String getIdClient() {
        return idClient;
    }

    public void setIdClient(String idClient) {
        this.idClient = idClient;
    }

    
    public void ouvrirCompte(Compte compte) {
        comptes.add(compte);
        compte.setClient(this);
    }

    public void fermerCompte(Compte compte) {
        comptes.remove(compte);
    }

    public void deposer(Compte compte, double montant) {
        compte.deposer(montant);
    }

    public void retrait(Compte compte, double montant) {
        compte.retrait(montant);
    }

    public double consulterSolde(Compte compte) {
        return compte.consulterSolde();
    }

    public void effectuerTransaction(Transaction transaction) {
        transaction.effectuer();
    }

    public List<Compte> getComptes() {
        return comptes;
    }
}
