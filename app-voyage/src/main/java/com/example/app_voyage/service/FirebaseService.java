package com.example.app_voyage.service;

import com.example.app_voyage.model.Traveler;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

import com.google.cloud.firestore.Firestore;

@Service
public class FirebaseService {

    public Firestore getFirestore() {
        return FirestoreClient.getFirestore();
    }
    private static final String COLLECTION_NAME = "users";

    public List<Traveler> getAllTravelers() {
        try {
            Firestore dbFirestore = FirestoreClient.getFirestore();
            ApiFuture<QuerySnapshot> future = dbFirestore.collection(COLLECTION_NAME).get();
            
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();

            List<Traveler> travelers = new ArrayList<>();
            for (QueryDocumentSnapshot document : documents) {
                Traveler traveler = document.toObject(Traveler.class);
                
                // Conversion explicite si nécessaire
                Object idUserObject = document.get("id_user");
                if (idUserObject instanceof String) {
                    traveler.setId_user(Integer.parseInt((String) idUserObject));
                } else if (idUserObject instanceof Number) {
                    traveler.setId_user(((Number) idUserObject).intValue());
                }
                
                travelers.add(traveler);
            }

            return travelers;
        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération des voyageurs : " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
        
    }
    
    public void addTraveler(Traveler traveler) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        dbFirestore.collection(COLLECTION_NAME)
                .document(String.valueOf(traveler.getId_user()))
                .set(traveler);
    }

    public boolean updateTraveler(int id, Traveler traveler) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference docRef = dbFirestore.collection(COLLECTION_NAME).document(String.valueOf(id));
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();

        if (document.exists()) {
            docRef.set(traveler, SetOptions.merge());
            return true;
        }
        return false;
    }
 // Supprimer un voyageur
    public boolean deleteTraveler(int id) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference docRef = dbFirestore.collection(COLLECTION_NAME).document(String.valueOf(id));
        
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();

        if (document.exists()) {
            // Supprimer le document
            docRef.delete();
            return true;
        }
        return false;
    }
}