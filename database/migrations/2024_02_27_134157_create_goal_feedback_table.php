<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('goal_feedback', function (Blueprint $table) {
      $table->id();
      $table->string('title');
      $table->string('description');
      $table->unsignedBigInteger('goal_id');
      $table->foreign('goal_id')->references('id')->on('goals')->onDelete('cascade');
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('goal_feedback');
  }
};
