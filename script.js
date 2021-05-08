$(document).ready(function() {
    let url = "https://pokeapi.co/api/v2/pokemon/";
    getPokemon(url);

    $("#more-pokemon").click(function(){
        getPokemon(this.dataset.nexturl);
    });
    
    $('#pokedex').click(function(event){
        if(event.target.dataset.pokemon_info){
            var pokemon_name = event.target.dataset.pokemon_info;
            var pokemon_url = event.target.dataset.pokemonurl;
            $("#pokeModalLabel").html(pokemon_name);
            getDataPokemon(pokemon_url)
        }
    })
});

    $('#pokemon-types').click(function(event){
        if(event.target.dataset.type){
            let type = event.target.dataset.type;
            // console.log(event.target.dataset.type);
            types_url = "https://pokeapi.co/api/v2/type/"+type;
            damageData(types_url);
            console.log(types_url);
        }
    });

    $('#pokemon-abilities').click(function(event){
        if(event.target.dataset.ability){
            let ability = event.target.dataset.ability
            // console.log("otherPokemonWithSameAbility");
            abilities_url = "https://pokeapi.co/api/v2/ability/"+ability;
            otherPokemonWithSameAbility(abilities_url);
        }
    });

    function getPokemon(url) {
        fetch(url)
            .then(function(data){
                return data.json()
            })
            .then(function(data){
                data.results.forEach(function(pokemon_info){
                    addPokemon(pokemon_info)
                    console.log(pokemon_info)
                });
                $("#more-pokemon").attr('data-nexturl', data.next)
            })
    }         
    
    function addPokemon(pokemon_info){
        let patt = /[0-9]+/g;
        let pokeid = pokemon_info.url.match(patt)[1];
        let details = `<div class='col-md-2'>
                            <div class="card mb-5 mt-5 pt-0 pb-0">
                                <div class="card-body">
                                    <img class="card-img-top" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeid}.png" alt="${pokemon_info.name} image">

                                    <h2 class="card-title text-center text-capitalize">
                                        ${pokemon_info.name}
                                    </h2>
                                    
                                    <a id='' href="#" data-pokemonurl="${pokemon_info.url}" class="btn btn-primary btn-pokemodal" data-toggle="modal" data-target="#pokeModal" data-pokemon_info="${pokemon_info.name}">
                                        ¡Quiero ver más de este pokémon!
                                    </a>
                                </div>
                            </div>
                        </div>`

        $("#pokedex").append(details);
    }
    
    function getDataPokemon(pokemon_url){
        cleanResultsPokeModal()
        fetch(pokemon_url)
            .then(function(data_result){
                return data_result.json()
            })
            .then(function(data){
                data.types.forEach(function(result){
                    let li_type = document.createElement('li');
                        li_type.append(result.type.name);
                        console.log(result.type.name)
                $("#pokemon-types").append(li_type);
                    let button_type = document.createElement('button');
                        button_type.className = "btn btn-primary btn-sm mb-2";
                        button_type.dataset.type = result.type.name;
                    // console.log(button_type.dataset.type)
                        button_type.appendChild(document.createTextNode("Ver relaciones de daño"));
                $("#pokemon-types").append(button_type);

                })
    
                data.game_indices.forEach(function(result){
                    let li_gen = document.createElement('li');
                        li_gen.append(result.version.name);
                $("#pokemon-generations").append(li_gen);
                })
    
                move_counter = 0;
                data.moves.forEach(function(result){
                    move_counter++;
                    if(move_counter < 6){
                        let li_move = document.createElement('li');
                            li_move.append(result.move.name);
                $("#pokemon-moves").append(li_move);
                    }
                })
    
                data.abilities.forEach(function(result){
                    let li_ability = document.createElement('li');
                        li_ability.append(result.ability.name);
                $("#pokemon-abilities").append(li_ability);
                    let button_ability = document.createElement('button');
                        button_ability.className = "btn btn-warning btn-sm mb-2";
                        button_ability.dataset.ability = result.ability.name;
                        button_ability.appendChild(document.createTextNode("Otros pokémon que tienen esta habilidad"));
                $("#pokemon-abilities").append(button_ability);
                })        
            })
    }

        // función para extraer y mostrar la info de las damage relations
        function damageData(types_url){
            cleanResultsPokeModalType()
            fetch(types_url)
                .then(function(data_result){
                    return data_result.json();
                })
                .then(function(data){
                    let ddf = $("#double_damage_from"),
                        ddfResponse = data.damage_relations.double_damage_from,
                        ddt = $("#double_damage_to"),
                        ddtResponse = data.damage_relations.double_damage_to,
                        hdf = $("#half_damage_from"),
                        hdfResponse = data.damage_relations.half_damage_from,
                        hdt = $("#half_damage_to"),
                        hdtResponse = data.damage_relations.half_damage_to,
                        ndf = $("#no_damage_from"),
                        ndfResponse = data.damage_relations.no_damage_from,
                        ndt = $("#no_damage_to"),
                        ndtResponse = data.damage_relations.no_damage_to;

                    showDamageRelations(ddfResponse, ddf) 
                    showDamageRelations(ddtResponse, ddt)
                    showDamageRelations(hdfResponse, hdf)
                    showDamageRelations(hdtResponse, hdt)
                    showDamageRelations(ndfResponse, ndf)
                    showDamageRelations(ndtResponse, ndt)
            $("#pokeModalType").modal('show');
            })
        }
        
        // función para extraer la info de los pokes con la misma habilidad 
        function otherPokemonWithSameAbility(abilities_url){
            $("#pokemon_same_abilities").html("");
            fetch(abilities_url)
            .then(function(response){
                return response.json();
            })
            .then(function(data_result){
                let data_lenght = data_result.pokemon.length
                    console.log(data_lenght)
                if(data_lenght == 0){
                    let li_ability = document.createElement('li');
                    li_ability.appendChild(document.createTextNode("None"));
                    $("#pokemon_same_abilities").append(li_ability);
                }else{
                    data_result.pokemon.forEach(function(data){
                        console.log(data);
                        let li_ability = document.createElement('li');
                            li_ability.append(data.pokemon.name);
                    $("#pokemon_same_abilities").append(li_ability);
                    })
                }
            
            $("#pokeModalAbilities").modal('show');
            })
        }
                
        // función para limpiar el Pokemodal
        function cleanResultsPokeModal(){
            $("#pokemon-types").html("");
            $("#pokemon-generations").html("");
            $("#pokemon-moves").html("");
            $("#pokemon-abilities").html("");
        }

        // función para limpiar el modal de relaciones de damage
        function cleanResultsPokeModalType(){
            $("#double_damage_from").html("");
            $("#double_damage_to").html("");
            $("#half_damage_from").html("");
            $("#half_damage_to").html("");
            $("#no_damage_from").html("");
            $("#no_damage_to").html("");
        }

        // función para mostrar la info del modal de relaciones de daño
        function showDamageRelations(damageResponse, damageKind){
            let data_lenght = damageResponse.length
            if(data_lenght == 0){
                let li_damage = document.createElement('li');
                li_damage.appendChild(document.createTextNode("None"));
                damageKind.append(li_damage);
            }else{
                damageResponse.forEach(function(damage){
                    console.log(damage);
                    let li_damage = document.createElement('li');
                    li_damage.append(damage.name);
                    damageKind.append(li_damage);
                })
            }
        }

        // Metodo para cerrar ambos modales
        $('.close_second_modal').click(function() {
            $('#pokeModal').modal('hide');
        });
