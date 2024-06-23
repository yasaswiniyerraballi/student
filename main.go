package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/hojabri/backend/handlers"
	"github.com/hojabri/backend/repository"
)

func main() {
	// Connect to database
	_, err := repository.Connect()
	if err != nil {
		log.Fatal(err)
	}

	// Create a new Fiber instance
	app := fiber.New()

	// Serve static files from the public directory
	app.Static("/", "./public")

	// Use logger
	app.Use(logger.New())

	// Group User related APIs
	userGroup := app.Group("/users")

	userGroup.Get("/", handlers.GetAllUsers)
	userGroup.Get("/:id", handlers.GetSingleUser)
	userGroup.Post("/", handlers.AddNewUser)
	userGroup.Put("/:id", handlers.UpdateUser)
	userGroup.Delete("/:id", handlers.DeleteUser)

	// Group Company related APIs
	companyGroup := app.Group("/companies")

	companyGroup.Get("/", handlers.GetAllCompanies)
	companyGroup.Get("/:id", handlers.GetSingleCompany)
	companyGroup.Post("/", handlers.AddNewCompany)
	companyGroup.Put("/:id", handlers.UpdateCompany)
	companyGroup.Delete("/:id", handlers.DeleteCompany)

	// Group CompanyCategory related APIs
	companyCategoryGroup := app.Group("/categories")

	companyCategoryGroup.Get("/", handlers.GetAllCompanyCategories)
	companyCategoryGroup.Get("/:id", handlers.GetSingleCompanyCategory)
	companyCategoryGroup.Post("/", handlers.AddNewCompanyCategory)
	companyCategoryGroup.Put("/:id", handlers.UpdateCompanyCategory)
	companyCategoryGroup.Delete("/:id", handlers.DeleteCompanyCategory)

	// Start the Fiber app on port 3000
	log.Println("Server started on :3000")
	log.Fatal(app.Listen(":3000"))
}
