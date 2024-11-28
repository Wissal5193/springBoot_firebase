package com.example.app_voyage.service;


import com.example.app_voyage.model.Traveler;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;


public class TravelerService {

    public List<Traveler> getAllUsers() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        // Accéder à la collection "user"
        ApiFuture<QuerySnapshot> future = db.collection("travelers").get();

        // Récupérer les documents
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        List<Traveler> traveler = new ArrayList<>();

        for (QueryDocumentSnapshot document : documents) {
        	Traveler Traveler = document.toObject(Traveler.class);
        	traveler.add(Traveler);
        }

        return traveler;
    }
}