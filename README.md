# RELATÓRIO

## Animal

- É uma class abstrata que representa um animal.
- Possui os atributos `nome`, `idade` e `cpfDono`.

## Cachorro, Gato e Coelhos

- São classes que herdam de `Animal`.

## Clinic

- É uma classe que representa uma clínica veterinária.
- Possui os métodos `get_medicine`: que recebe um `medicine_id` e retorna o medicamento correspondente.
- `add_medicine`: que recebe um medicamento e adiciona ao estoque.
- `remove_medicine`: que recebe um `medicine_id` e remove o medicamento correspondente do estoque.
- `prescribe_medicine`: que recebe um `animal_id`, `medicine_id` e `quantity` e prescreve o medicamento para o animal correspondente.

## AnimalS Controller

- É uma classe que representa um controlador de animais.

- `create_animal`: que recebe um animal e o adiciona ao banco de dados.
- `get_animals`: que retorna todos os animais do banco de dados.

## Clients Controller

- É uma classe que representa um controlador de clientes.
- Possui os métodos `create_client`: que recebe um cliente e o adiciona ao banco de dados.
- `get_clients`: que retorna todos os clientes do banco de dados, transformando os `animal_id` em objetos de animais.

## Medicines Controller

- É uma classe que representa um controlador de medicamentos.
- Possui os métodos `add_medicine`: que recebe um medicamento e o adiciona ao estoque.
- `remove_medicine`: que recebe um `medicine_id` e remove o medicamento correspondente do estoque.
- `prescribe_medicine`: que recebe um `animal_id`, `medicine_id` e `quantity` e prescreve o medicamento para o animal correspondente.
- `get_stock`: que retorna todos os medicamentos do estoque.



