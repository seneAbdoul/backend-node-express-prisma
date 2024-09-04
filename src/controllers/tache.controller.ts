import { Request, Response } from "express";
import Controller from "../core/impl/controller";
import prisma from "../core/impl/prisma.model";
import RestResponse from "../core/response";
import { StatusCodes } from "http-status-codes";

export class TacheController extends Controller {
  // Méthode pour créer une nouvelle tâche
  async store(req: Request, res: Response) {
    try {
      const { libelle, statut, userId, etat } = req.body;

      const newTache = await prisma.tache.create({
        data: {
          libelle,
          statut,
          etat,
          userId,
        },
      });

      res.status(StatusCodes.OK).send(RestResponse.response(newTache, StatusCodes.OK));
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).send(
        RestResponse.response("Erreur lors de la création de la tâche", StatusCodes.BAD_REQUEST)
      );
    }
  }

  // Méthode pour récupérer toutes les tâches
  async show(req: Request, res: Response) {
    try {
      const taches = await prisma.tache.findMany({
        select: {
          id: true,
          libelle: true,
          statut: true,
          etat: true,
          user: {
            select: {
              username: true,
            },
          },
        },
      });

      res.status(StatusCodes.OK).send(RestResponse.response(taches, StatusCodes.OK));
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).send(
        RestResponse.response("Tâches non trouvées", StatusCodes.NOT_FOUND)
      );
    }
  }

  // Méthode pour récupérer une tâche par ID
  async edit(req: Request, res: Response) {
    try {
      const tacheId = parseInt(req.params.id);

      const tache = await prisma.tache.findFirstOrThrow({
        where: { id: tacheId },
        select: {
          id: true,
          libelle: true,
          statut: true,
          etat: true,
          user: {
            select: {
              username: true,
            },
          },
        },
      });

      res.status(StatusCodes.OK).send(RestResponse.response(tache, StatusCodes.OK));
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).send(
        RestResponse.response("Tâche non trouvée", StatusCodes.NOT_FOUND)
      );
    }
  }

// Méthode pour récupérer toutes les tâches d'un utilisateur à partir de son ID
async getTachesByUserId(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);

      if (isNaN(userId)) {
        return res.status(StatusCodes.BAD_REQUEST).send(
          RestResponse.response("Invalid user ID", StatusCodes.BAD_REQUEST)
        );
      }

      const taches = await prisma.tache.findMany({
        where: { userId },
        select: {
          id: true,
          libelle: true,
          statut: true,
          etat: true,
          createdAt: true,
          updatedAt: true,
          user: { 
            select: {
              username: true,
            }
          }
        },
      });

      if (taches.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).send(
          RestResponse.response("Aucune tâche trouvée pour cet utilisateur", StatusCodes.NOT_FOUND)
        );
      }

      const tachesWithUsername = taches.map(tache => ({
        ...tache,
        username: tache.user.username
      }));

      res.status(StatusCodes.OK).send(RestResponse.response(tachesWithUsername, StatusCodes.OK));
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
        RestResponse.response("Erreur lors de la récupération des tâches", StatusCodes.INTERNAL_SERVER_ERROR)
      );
    }
  }
  
}
