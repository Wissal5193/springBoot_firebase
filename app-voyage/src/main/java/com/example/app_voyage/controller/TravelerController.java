package com.example.app_voyage.controller;

import com.example.app_voyage.model.Traveler;
import com.example.app_voyage.service.FirebaseService;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.SetOptions;
import com.google.firebase.cloud.FirestoreClient;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@CrossOrigin(origins = "*") // Autorise toutes les origines (modifiable pour plus de sécurité)
@RestController
@RequestMapping("/api/travelers")
public class TravelerController {
    private final FirebaseService firebaseService;

    public TravelerController(FirebaseService firebaseService) {
        this.firebaseService = firebaseService;
    }

    @GetMapping
    public List<Traveler> getAllTravelers() {
        try {
            return firebaseService.getAllTravelers();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la récupération des voyageurs.");
        }
    }
    
    @PostMapping
    public String addTraveler(@RequestBody Traveler traveler) throws ExecutionException, InterruptedException {
        firebaseService.getFirestore()
                .collection("users")
                .document(String.valueOf(traveler.getId_user())) // Crée un document avec l'ID utilisateur
                .set(traveler); // Ajoute les données du voyageur
        System.out.println("Données reçues : " + traveler);
        return "Voyageur ajouté avec succès !";
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<String> updateTraveler(@PathVariable int id, @RequestBody Traveler traveler) {
        try {
            Firestore dbFirestore = FirestoreClient.getFirestore();

            // Référence au document spécifique
            DocumentReference docRef = dbFirestore.collection("users").document(String.valueOf(id));

            // Vérifiez si le document existe avant de tenter une mise à jour
            ApiFuture<DocumentSnapshot> future = docRef.get();
            DocumentSnapshot document = future.get();

            if (!document.exists()) {
                System.out.println("Document non trouvé pour l'ID : " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Voyageur non trouvé.");
            }

            // Affichez les données reçues pour vérification
            System.out.println("Données reçues pour mise à jour : " + traveler);

            // Effectuez la mise à jour en fusionnant les nouvelles données avec les anciennes
            docRef.set(traveler, SetOptions.merge());

            return ResponseEntity.ok("Voyageur mis à jour avec succès !");
        } catch (Exception e) {
            // Log d'erreur
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Erreur lors de la mise à jour : " + e.getMessage());
        }
    }

    // Supprimer un voyageur
    @DeleteMapping("/{id}")
    public boolean deleteTraveler(@PathVariable int id) {
        try {
            return firebaseService.deleteTraveler(id);
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
            return false;
        }
    }
    
    
    @SuppressWarnings("unused")
	@GetMapping("/test-firebase")
    public String testFirebaseConnection() {
        try {
            Firestore dbFirestore = FirestoreClient.getFirestore();
            return "Connexion Firebase réussie !";
        } catch (Exception e) {
            e.printStackTrace();
            return "Erreur Firebase : " + e.getMessage();
        }
    }

}
