import { Component } from '@angular/core';

@Component({
  selector: 'app-comments',
  standalone: true,
  template: `
    <div class="team-container">
      <!-- Seção da Product Owner (PO) -->
      <div class="po-section">
        <h2>Product Owner</h2>
        <div class="profile-card">
          <img src="assets/images/adicineia.jpg" alt="Product Owner" class="profile-pic-po">
          <div class="profile-info">
            <h3>Adicineia Oliveira</h3>
            <p>Product Owner</p>
          </div>
        </div>
      </div>

      <!-- Seção dos Desenvolvedores -->
      <div class="devs-section">
        <h2>Equipe de Desenvolvedores</h2>
        <div class="profile-card">
          <img src="assets/images/profile.jpg" alt="Gyovani Santos" class="profile-pic">
          <div class="profile-info">
            <h3>Gyovani Santos</h3>
            <p>Desenvolvendor Full Stack</p>
          </div>
        </div>
        <div class="profile-card">
          <img src="assets/images/pablo.png" alt="Pablo Freire" class="profile-pic">
          <div class="profile-info">
            <h3>Pablo Freire</h3>
            <p>Desenvolvedor Back-End</p>
          </div>
        </div>
        <div class="profile-card">
          <img src="assets/images/Quentino.jpg" alt="Felipe Quentino" class="profile-pic">
          <div class="profile-info">
            <h3>Felipe Quentino</h3>
            <p>Analista de Banco de Dados</p>
          </div>
        </div>
        <div class="profile-card">
          <img src="assets/images/benevides.png" alt="Victor Benevides" class="profile-pic">
          <div class="profile-info">
            <h3>Victor Benevides</h3>
            <p>Engenheiro de Software</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .team-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
      box-sizing: border-box;
    }
    .po-section, .devs-section {
      text-align: center;
      margin-bottom: 2rem;
    }
    .po-section h2, .devs-section h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
      color: #333;
    }
    .profile-card {
      display: inline-block;
      margin: 1rem;
      vertical-align: top;
    }
    .profile-pic {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #007bff;
    }
    .profile-pic-po {
      width: 300px;
      height: 300px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #007bff;
    }
    .profile-info {
      margin-top: 0.5rem;
    }
    .profile-info h3 {
      margin: 0.5rem 0 0.25rem;
      font-size: 1.2rem;
      color: #333;
    }
    .profile-info p {
      margin: 0;
      font-size: 1rem;
      color: #555;
    }
    @media (max-width: 600px) {
      .profile-pic {
        width: 100px;
        height: 100px;
      }
      .profile-info h3 {
        font-size: 1rem;
      }
      .profile-info p {
        font-size: 0.9rem;
      }
    }
  `]
})
export class CommentsComponent { }
