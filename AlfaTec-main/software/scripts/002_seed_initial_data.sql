-- Seed data inicial para o PetShop

-- Inserir serviços padrão
INSERT INTO services (name, description, category, duration_minutes, price) VALUES
  ('Banho Pequeno Porte', 'Banho completo para cães e gatos de pequeno porte (até 10kg)', 'grooming', 60, 50.00),
  ('Banho Médio Porte', 'Banho completo para cães de médio porte (10-25kg)', 'grooming', 90, 70.00),
  ('Banho Grande Porte', 'Banho completo para cães de grande porte (acima de 25kg)', 'grooming', 120, 90.00),
  ('Tosa Higiênica', 'Tosa das regiões íntimas, patas e orelhas', 'grooming', 30, 35.00),
  ('Tosa Completa', 'Tosa completa do corpo todo', 'grooming', 90, 80.00),
  ('Banho + Tosa Completa', 'Combo de banho e tosa completa', 'grooming', 150, 120.00),
  ('Consulta Veterinária', 'Consulta com veterinário', 'veterinary', 30, 150.00),
  ('Vacinação', 'Aplicação de vacina (valor da vacina não incluso)', 'veterinary', 15, 50.00),
  ('Day Care - Diária', 'Cuidado diário com passeios e brincadeiras', 'daycare', 480, 80.00),
  ('Day Care - Meio Período', 'Cuidado por meio período (4 horas)', 'daycare', 240, 50.00),
  ('Hidratação de Pelos', 'Tratamento de hidratação profunda', 'grooming', 45, 45.00),
  ('Corte de Unhas', 'Corte e lixamento de unhas', 'grooming', 15, 25.00)
ON CONFLICT DO NOTHING;

-- Inserir categorias de produtos
INSERT INTO product_categories (name, description) VALUES
  ('Rações', 'Rações para cães e gatos'),
  ('Petiscos', 'Petiscos e snacks'),
  ('Medicamentos', 'Medicamentos e suplementos'),
  ('Higiene', 'Produtos de higiene e limpeza'),
  ('Acessórios', 'Coleiras, guias, brinquedos e outros acessórios'),
  ('Camas e Casas', 'Camas, casinhas e almofadas'),
  ('Comedouros', 'Comedouros e bebedouros')
ON CONFLICT DO NOTHING;

-- Inserir alguns produtos de exemplo
INSERT INTO products (category_id, name, description, sku, cost_price, sale_price, stock_quantity, min_stock, unit) 
SELECT 
  pc.id,
  p.name,
  p.description,
  p.sku,
  p.cost_price,
  p.sale_price,
  p.stock_quantity,
  p.min_stock,
  p.unit
FROM (VALUES
  ('Rações', 'Ração Premium Cães Adulto 15kg', 'Ração super premium para cães adultos', 'RAC001', 120.00, 189.90, 25, 5, 'un'),
  ('Rações', 'Ração Premium Gatos Adulto 10kg', 'Ração super premium para gatos adultos', 'RAC002', 90.00, 149.90, 20, 5, 'un'),
  ('Rações', 'Ração Filhotes Cães 10kg', 'Ração para filhotes de cães', 'RAC003', 100.00, 159.90, 15, 5, 'un'),
  ('Petiscos', 'Bifinho de Carne 500g', 'Petisco de carne para cães', 'PET001', 15.00, 29.90, 30, 10, 'un'),
  ('Petiscos', 'Snack Dental Cães', 'Petisco para higiene dental', 'PET002', 18.00, 35.90, 25, 10, 'un'),
  ('Medicamentos', 'Vermífugo Cães', 'Vermífugo oral para cães', 'MED001', 25.00, 45.90, 20, 5, 'un'),
  ('Medicamentos', 'Antipulgas e Carrapatos', 'Pipeta antipulgas e carrapatos', 'MED002', 35.00, 65.90, 30, 10, 'un'),
  ('Higiene', 'Shampoo Neutro 500ml', 'Shampoo para cães e gatos', 'HIG001', 12.00, 24.90, 40, 10, 'un'),
  ('Higiene', 'Condicionador 500ml', 'Condicionador para pelos', 'HIG002', 14.00, 28.90, 35, 10, 'un'),
  ('Acessórios', 'Coleira Nylon M', 'Coleira de nylon tamanho M', 'ACE001', 8.00, 19.90, 50, 15, 'un'),
  ('Acessórios', 'Guia Retrátil 5m', 'Guia retrátil para passeios', 'ACE002', 25.00, 49.90, 20, 5, 'un'),
  ('Acessórios', 'Brinquedo Bolinha', 'Bolinha de borracha resistente', 'ACE003', 5.00, 14.90, 60, 20, 'un'),
  ('Camas e Casas', 'Cama Pet M', 'Cama confortável tamanho M', 'CAM001', 45.00, 89.90, 15, 3, 'un'),
  ('Comedouros', 'Comedouro Inox M', 'Comedouro de inox tamanho M', 'COM001', 12.00, 29.90, 30, 10, 'un')
) AS p(category_name, name, description, sku, cost_price, sale_price, stock_quantity, min_stock, unit)
JOIN product_categories pc ON pc.name = p.category_name
ON CONFLICT DO NOTHING;

-- Inserir alguns clientes de exemplo
INSERT INTO customers (name, email, phone, cpf, address, city, neighborhood, zip_code) VALUES
  ('Maria Silva', 'maria.silva@email.com', '(11) 99999-1111', '123.456.789-00', 'Rua das Flores, 123', 'São Paulo', 'Centro', '01234-000'),
  ('João Santos', 'joao.santos@email.com', '(11) 99999-2222', '234.567.890-11', 'Av. Brasil, 456', 'São Paulo', 'Jardim América', '04567-000'),
  ('Ana Costa', 'ana.costa@email.com', '(11) 99999-3333', '345.678.901-22', 'Rua das Palmeiras, 789', 'São Paulo', 'Vila Mariana', '04123-000')
ON CONFLICT DO NOTHING;

-- Inserir pets de exemplo
INSERT INTO pets (customer_id, name, species, breed, color, birth_date, weight, gender)
SELECT 
  c.id,
  p.name,
  p.species,
  p.breed,
  p.color,
  p.birth_date::DATE,
  p.weight,
  p.gender
FROM (VALUES
  ('Maria Silva', 'Thor', 'dog', 'Golden Retriever', 'Dourado', '2020-03-15', 32.5, 'male'),
  ('Maria Silva', 'Luna', 'cat', 'Persa', 'Branco', '2021-06-20', 4.2, 'female'),
  ('João Santos', 'Max', 'dog', 'Bulldog Francês', 'Caramelo', '2019-11-10', 12.8, 'male'),
  ('Ana Costa', 'Nina', 'dog', 'Poodle', 'Preto', '2022-01-05', 5.5, 'female'),
  ('Ana Costa', 'Mia', 'cat', 'Siamês', 'Creme', '2021-09-12', 3.8, 'female')
) AS p(customer_name, name, species, breed, color, birth_date, weight, gender)
JOIN customers c ON c.name = p.customer_name
ON CONFLICT DO NOTHING;
